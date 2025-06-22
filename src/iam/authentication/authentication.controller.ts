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
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
            const { accessToken, refreshToken } = await this.authenticationService.signIn(signInDto);
            if (!accessToken || !refreshToken) {
                throw new UnauthorizedException('Invalid credentials');
            }
            return {
                accessToken,
                refreshToken
            }
        } catch (error) {
            throw new InternalServerErrorException('An error occurred during sign-in');
        }
    }

    @Post('refresh-tokens')
    refreshTokens(
        @Res({ passthrough: true }) res: Response,
        @Body() refreshToken: RefreshTokenDto
    ) {
        return this.authenticationService.refreshTokens(refreshToken)
    }
}
