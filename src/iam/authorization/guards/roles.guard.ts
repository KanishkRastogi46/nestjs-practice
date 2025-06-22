import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { REQUEST_USER_KEY } from 'src/iam/authentication/constants/auth.constant';
import { ActiveUserData } from 'src/iam/authentication/interfaces/active-user.interface';
import { ROLES_USER_KEY } from 'src/users/constants/roles.constants';
import { Roles } from 'src/users/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<Roles[]>(
      ROLES_USER_KEY,
      [context.getClass(), context.getHandler()]
    )

    if (!roles) return true

    const user: ActiveUserData = context.switchToHttp().getRequest()[REQUEST_USER_KEY]
    return roles.some(role => user.role === role)
  }
}
