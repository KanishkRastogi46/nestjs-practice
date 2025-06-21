import { SetMetadata } from "@nestjs/common";
import { AuthType } from "../enums/auth-type.enum";
import { AUTH_TYPE_KEY } from "../constants/auth.constant";

export const AuthDecorator = (...authType: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, authType);