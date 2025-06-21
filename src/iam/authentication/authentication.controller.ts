import { 
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Post,
    Res,
    UnauthorizedException
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDtoTs } from './dto/sign-up.dto.ts';
import { SignInDtoTs } from './dto/sign-in.dto.ts';
import { Response } from 'express';
import { AuthDecorator } from './decorators/auth-type.decorator';
import { AuthType } from './enums/auth-type.enum';

@AuthDecorator(AuthType.None)
@Controller('auth')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService
    ) {}

    @Post('sign-up')
    signUp(@Body() signupDto: SignUpDtoTs) {
        return this.authenticationService.signup(signupDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(
        @Res({ passthrough: true}) res: Response,
        @Body() signInDto: SignInDtoTs) {
        try {
            const accessToken = await this.authenticationService.signIn(signInDto);
            if (!accessToken) {
                throw new UnauthorizedException('Invalid credentials');
            }
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'strict', // Adjust as necessary for your application
                maxAge: 60 * 60 * 1000 // 1 hour
            })
        } catch (error) {
            throw new InternalServerErrorException('An error occurred during sign-in');
        }
    }
}
