import { 
    ConflictException, 
    HttpException, 
    Inject, 
    Injectable, 
    InternalServerErrorException, 
    NotFoundException, 
    UnauthorizedException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../providers/hashing.service';
import { SignUpDtoTs } from './dto/sign-up.dto.ts';
import { SignInDtoTs } from './dto/sign-in.dto.ts';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from './interfaces/active-user.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly hashingService: HashingService,

        private readonly jwtService: JwtService,
        
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) {}

    async signup(signupDto: SignUpDtoTs) {
        try {
            if (!signupDto.email || !signupDto.password) {
                throw new HttpException('Email and password are required', 400);
            }

            const hashedPassword = await this.hashingService.hash(signupDto.password);
            const user = this.userRepository.create({
                email: String(signupDto.email),
                password: String(hashedPassword)
            })
            return await this.userRepository.save(user);
        } catch (error) {
            const pgUniqueViolationError = '23505'; // PostgreSQL unique violation error code
            if (error.code === pgUniqueViolationError) {
                throw new ConflictException(`Email ${signupDto.email} is already in use.`);
            }
            throw new HttpException('An error occurred while signing up', 500);
        }
    }

    async signIn(signInDto: SignInDtoTs) {
        try {
            const user = await this.userRepository.findOneBy({ email: signInDto.email });
            if (!user) {
                throw new NotFoundException(`User with email ${signInDto.email} not found`);
            }

            const isPasswordValid = await this.hashingService.compare(signInDto.password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException(`Invalid credentials for email ${signInDto.email}`);
            }

            const [accessToken, refreshToken] = await Promise.all(
                [
                    this.signToken<Partial<ActiveUserData>>(
                        user.id, 
                        this.jwtConfiguration.accessTokenTtl, 
                        { email: user.email }
                    ),

                    this.signToken<Partial<ActiveUserData>>(
                        user.id, 
                        this.jwtConfiguration.refreshTokenTtl,
                    )
                ]
            )

            return {
                accessToken,
                refreshToken
            }
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while signing in');
        }
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        try {
            const { sub } = await this.jwtService.verifyAsync<
            Pick<ActiveUserData, 'sub'>
            >(
                refreshTokenDto.refreshToken,
                {
                    secret: this.jwtConfiguration.secret,
                    audience: this.jwtConfiguration.audience,
                    issuer: this.jwtConfiguration.issuer
                }
            )

            const user = await this.userRepository.findOneByOrFail({ id: sub })
            const { accessToken, refreshToken } = await this.generateTokens(user)
            return {
                accessToken,
                refreshToken
            }
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while refreshing tokens');           
        }
    }

    async generateTokens(user: User) {
        try {
            const [accessToken, refreshToken] = await Promise.all(
                [
                    this.signToken<Partial<ActiveUserData>>(
                        user.id, 
                        this.jwtConfiguration.accessTokenTtl, 
                        { email: user.email }
                    ),

                    this.signToken<Partial<ActiveUserData>>(
                        user.id, 
                        this.jwtConfiguration.refreshTokenTtl,
                    )
                ]
            )

            return {
                accessToken,
                refreshToken
            }
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while generating tokens');            
        }
    }

    private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
        try {
            return await this.jwtService.signAsync(
                    { 
                        sub: userId,
                        ...payload
                    },
                    {
                        secret: this.jwtConfiguration.secret,
                        audience: this.jwtConfiguration.audience,
                        issuer: this.jwtConfiguration.issuer,
                        expiresIn: expiresIn
                    }
                )
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while signing the token');           
        }
    }
}
