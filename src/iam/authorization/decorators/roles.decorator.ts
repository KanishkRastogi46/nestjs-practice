import { SetMetadata } from "@nestjs/common";
import { ROLES_USER_KEY } from "src/users/constants/roles.constants";
import { Roles } from "src/users/enums/roles.enum";

export const RolesDecorator = (...roles: Roles[]) => SetMetadata(ROLES_USER_KEY, roles)