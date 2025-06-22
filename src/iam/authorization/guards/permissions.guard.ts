import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { PermissionType } from "../permissions.type";
import { COFFEE_PERMISSIONS_KEY } from "src/coffees/coffees.constant";
import { ActiveUserData } from "src/iam/authentication/interfaces/active-user.interface";
import { REQUEST_USER_KEY } from "src/iam/authentication/constants/auth.constant";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const permissions = this.reflector.getAllAndOverride<PermissionType[]>(
            COFFEE_PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()]
        )

        if (!permissions) return true

        const user: ActiveUserData = context.switchToHttp().getRequest()[REQUEST_USER_KEY]
        return permissions.every(permission => user.permissions.includes(permission))
    }
}