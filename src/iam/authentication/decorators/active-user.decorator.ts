import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { REQUEST_USER_KEY } from "../constants/auth.constant";
import { ActiveUserData } from "../interfaces/active-user.interface";

export const ActiveUser = createParamDecorator(
    (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>()
        const user: ActiveUserData = request[REQUEST_USER_KEY]
        return field ? user?.[field] : user
    }
)