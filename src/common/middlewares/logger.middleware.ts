import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: () => void) {
    console.log('Inside Logger Middleware');
    console.log('Request-response time');
    res.on('finish', () => console.log(new Date().toISOString()));
    next();
  }
}
