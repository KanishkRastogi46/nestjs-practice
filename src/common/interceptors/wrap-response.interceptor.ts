import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before handling the request...')
    return next.handle().pipe(tap(data => {
      console.log('After handling the request...')
      console.log('Data:', data);
    }))
  }
}
