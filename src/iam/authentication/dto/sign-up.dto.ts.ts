import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { PermissionType } from "src/iam/authorization/permissions.type";

export class SignUpDtoTs {
    @IsEmail()
    email: string

    @MinLength(6)
    password: string

    @IsNotEmpty()
    @IsEnum(['admin', 'regular'])
    @IsString()
    role: string

    @IsArray()
    @IsString({ each: true })
    permissions: PermissionType[]
}
