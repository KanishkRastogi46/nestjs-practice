import { PermissionType } from "src/iam/authorization/permissions.type"

export interface ActiveUserData {
    sub: number
    email: string
    role: string
    permissions: PermissionType[]
}