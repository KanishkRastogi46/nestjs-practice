import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before handling the request...')
    // return next.handle().pipe(tap(data => {
    //   console.log('After handling the request...')
    //   console.log('Data:', data);
    // }))
    return next.handle().pipe(map(
      data => (
        console.log('After handling the request...'),
        {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: 'Request was successful',
          data: data
        }
      )
    ))
  }
}
