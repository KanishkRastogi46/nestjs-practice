import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // const request = ctx.getRequest<Request>();
    // const next = ctx.getNext<NextFunction>();

    const exceptionStatus = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const error = typeof exceptionResponse === 'string'
      ? { message: exceptionResponse }
      : (exceptionResponse as Object)

    response.status(exceptionStatus).json({
      ...error,
      statusCode: exceptionStatus,
      timestamp: new Date().toISOString(),
    })
  }
}
