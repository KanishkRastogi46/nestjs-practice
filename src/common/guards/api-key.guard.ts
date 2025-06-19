import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());

    if (!isPublic) { 
      const ctx = context.switchToHttp();
      const request = ctx.getRequest<Request>();
      const apiKey = request.headers['x-api-key'];
      // const response = ctx.getResponse<Response>();

      return apiKey === this.configService.get<string>('API_KEY');
    }

    return true;
  }
}
