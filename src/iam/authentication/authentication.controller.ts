import { 
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDtoTs } from './dto/sign-up.dto.ts';
import { SignInDtoTs } from './dto/sign-in.dto.ts';

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
    signIn(@Body() signInDto: SignInDtoTs) {
        return this.authenticationService.signIn(signInDto);
    }
}
