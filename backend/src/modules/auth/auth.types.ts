import type { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  role: UserRole;
  companyId?: string;
  partnerId?: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  companyId?: string;
  partnerId?: string;
}
