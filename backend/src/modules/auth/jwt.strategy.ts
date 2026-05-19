import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../../shared/prisma/prisma.service';
import type { AuthUser, JwtPayload } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'development-only-secret',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const membership = await this.prisma.employeeMembership.findUnique({
      where: { userId: payload.sub },
      select: { companyId: true },
    });

    return {
      id: payload.sub,
      email: '',
      role: payload.role,
      companyId: membership?.companyId,
      partnerId: payload.partnerId,
    };
  }
}
