import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import { EmployeeStatus, User } from '@prisma/client';

import { ConflictError, UnauthorizedError, ValidationAppError } from '../../shared/errors/app-error';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import type { AuthTokens, JwtPayload } from './auth.types';
import type {
  LoginInput,
  RefreshInput,
  SignupInput,
  VerifyCorporateEmailInput,
  VerifyOtpInput,
} from './auth.schemas';
import { hashPassword, verifyPassword } from './password.service';

const OTP_TTL_SECONDS = 5 * 60;

type PublicUser = Pick<User, 'id' | 'email' | 'phone' | 'name' | 'role' | 'isVerified'>;

interface AuthResult {
  user: PublicUser;
  tokens: AuthTokens;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(input: SignupInput): Promise<AuthResult> {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, ...(input.phone ? [{ phone: input.phone }] : [])],
      },
    });
    if (existing !== null) {
      throw new ConflictError('อีเมลหรือเบอร์โทรนี้ถูกใช้งานแล้ว');
    }

    const passwordHash =
      input.password !== undefined ? await hashPassword(input.password) : undefined;

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: input.email,
          phone: input.phone,
          passwordHash,
          name: input.name,
          wallet: { create: {} },
          profile: {
            create: {
              preferredCategories: [],
              wellnessGoals: [],
            },
          },
        },
      });
      return created;
    });

    await this.sendOtp(input.email);

    return {
      user: this.toPublicUser(user),
      tokens: await this.issueTokens(user),
    };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          ...(input.email ? [{ email: input.email }] : []),
          ...(input.phone ? [{ phone: input.phone }] : []),
        ],
      },
    });

    if (user === null || !user.isActive) {
      throw new UnauthorizedError();
    }

    if (input.password !== undefined) {
      if (user.passwordHash === null || !(await verifyPassword(input.password, user.passwordHash))) {
        throw new UnauthorizedError();
      }
    } else if (input.otp !== undefined) {
      await this.verifyOtp({
        target: input.email ?? input.phone ?? '',
        otp: input.otp,
      });
    } else {
      const target = input.email ?? input.phone;
      if (target === undefined) {
        throw new ValidationAppError({ target: ['email or phone is required'] });
      }
      await this.sendOtp(target);
    }

    return {
      user: this.toPublicUser(user),
      tokens: await this.issueTokens(user),
    };
  }

  async refresh(input: RefreshInput): Promise<AuthTokens> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(input.refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'development-refresh-secret',
    });
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: payload.sub } });
    return this.issueTokens(user);
  }

  async verifyOtp(input: VerifyOtpInput): Promise<{ verified: true }> {
    const stored = await this.redis.get(this.otpKey(input.target));
    if (stored !== input.otp) {
      throw new UnauthorizedError();
    }

    await this.redis.delete(this.otpKey(input.target));
    await this.prisma.user.updateMany({
      where: {
        OR: [{ email: input.target }, { phone: input.target }],
      },
      data: { isVerified: true },
    });

    return { verified: true };
  }

  async verifyCorporateEmail(
    input: VerifyCorporateEmailInput,
  ): Promise<{ sent: true } | { verified: true; companyId: string }> {
    if (input.otp === undefined) {
      await this.sendOtp(input.corporateEmail);
      return { sent: true };
    }

    await this.verifyOtp({ target: input.corporateEmail, otp: input.otp });
    const domain = input.corporateEmail.split('@')[1];
    if (domain === undefined) {
      throw new ValidationAppError({ corporateEmail: ['corporate email domain is required'] });
    }

    const company = await this.prisma.company.findUniqueOrThrow({
      where: { emailDomain: domain.toLowerCase() },
    });

    await this.prisma.employeeMembership.upsert({
      where: { userId: input.userId },
      update: {
        companyId: company.id,
        corporateEmail: input.corporateEmail,
        isEmailVerified: true,
        status: EmployeeStatus.ACTIVE,
      },
      create: {
        userId: input.userId,
        companyId: company.id,
        corporateEmail: input.corporateEmail,
        isEmailVerified: true,
        status: EmployeeStatus.ACTIVE,
      },
    });

    return { verified: true, companyId: company.id };
  }

  async sendOtp(target: string): Promise<{ sent: true }> {
    const otp = String(randomInt(100000, 999999));
    await this.redis.setWithTtl(this.otpKey(target), otp, OTP_TTL_SECONDS);
    return { sent: true };
  }

  private async issueTokens(user: Pick<User, 'id' | 'role'>): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'development-refresh-secret',
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '30d',
    });

    return { accessToken, refreshToken };
  }

  private otpKey(target: string): string {
    return `otp:${target.toLowerCase()}`;
  }

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}
