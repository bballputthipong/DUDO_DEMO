import { CanActivate, ExecutionContext, Injectable, mixin, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '@prisma/client';

import { UnauthorizedError } from '../../shared/errors/app-error';
import type { AuthUser } from './auth.types';
import { ROLES_KEY } from './roles.decorator';

interface RequestWithUser {
  user?: AuthUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (roles === undefined || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (user === undefined || !roles.includes(user.role)) {
      throw new UnauthorizedError();
    }

    return true;
  }
}

export function RoleGuard(...roles: UserRole[]): Type<CanActivate> {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      if (user === undefined || !roles.includes(user.role)) {
        throw new UnauthorizedError();
      }

      return true;
    }
  }

  return mixin(RoleGuardMixin);
}
