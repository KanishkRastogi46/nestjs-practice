import { SetMetadata } from "@nestjs/common";
import { PermissionType } from "../permissions.type";
import { COFFEE_PERMISSIONS_KEY } from "src/coffees/coffees.constant";

export const PermissionsDecorator = (...permissions: PermissionType[]) => SetMetadata(COFFEE_PERMISSIONS_KEY, permissions)