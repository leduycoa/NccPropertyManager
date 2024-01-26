import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler) {
    const now = Date.now();
    return next.handle().pipe(
      catchError((err) => {
        if (context.getType() === 'http') {
          const httpContext = context.switchToHttp();
          const request = httpContext.getRequest<Request>();
          const { method, originalUrl } = request;
          const { status, message } = err;

          const logMessage = `${method} ${originalUrl} ${status} ${message} (${Date.now() - now}ms)`;

          if (status >= 400) {
            this.logger.warn(logMessage);
          } else {
            this.logger.error(logMessage);
          }
        }

        return throwError(() => err);
      }),
    );
  }
}
