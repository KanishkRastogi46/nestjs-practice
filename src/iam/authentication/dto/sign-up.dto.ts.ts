import { IsEmail, MinLength } from "class-validator";

export class SignUpDtoTs {
    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;
}
