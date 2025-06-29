import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const ProtocolDecorator = createParamDecorator(
    (defaultValue: string, ctx: ExecutionContext) => {
        console.log({defaultValue});
        const request = ctx.switchToHttp().getRequest<Request>();
        return request.protocol || defaultValue;
    }
)