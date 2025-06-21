import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import jwtConfig from 'src/iam/config/jwt.config';
import { REQUEST_USER_KEY } from '../constants/auth.constant';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromRequest(req)
    if (!token) {
      throw new UnauthorizedException('Access token is missing')
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration
      )
      req[REQUEST_USER_KEY] = payload // Attach the user payload to the request object
    } catch (error) {
      throw new UnauthorizedException('Invalid access token')      
    }
    return true
  }

  private extractTokenFromRequest(request: Request) {
    const [_, token] = request.headers.authorization?.split(' ') ?? []
    return token
  }
}
