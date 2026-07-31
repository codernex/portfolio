import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const { statusCode } = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data,
        statusCode,
      })),
    );
  }
}
