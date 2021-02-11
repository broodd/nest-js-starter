import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      catchError(e => {
        if (
          ['SequelizeUniqueConstraintError', 'SequelizeDatabaseError'].includes(
            e.name,
          )
        ) {
          Object.getOwnPropertyNames(e).forEach(key =>
            !['name', 'message', 'sql'].includes(key) ? delete e[key] : {},
          );
        }

        if (e.response && e.response.statusCode === 413) {
          e.response.message = 'Max file size';
        }

        console.error(e);

        const response = {
          statusCode: 400,
          errors: ['error'],
        };

        if (e.response && e.response.message) {
          response.errors =
            typeof e.response.message === 'string'
              ? [e.response.message]
              : Array.isArray(e.response.message)
              ? e.response.message.map(error =>
                  typeof error === 'string'
                    ? error
                    : `error.property.${error.property}`,
                )
              : ['error'];
          response.statusCode = e.response.statusCode || 400;
        } else if (e.message) {
          response.errors =
            typeof e.message === 'string'
              ? [e.message]
              : Array.isArray(e.message)
              ? e.message
              : ['error'];

          response.statusCode = e.status || 400;
        }

        // Variables for loger
        req.errors = response.errors;
        req.serverError = JSON.stringify(e, Object.getOwnPropertyNames(e));

        throw new HttpException(response, response.statusCode);
      }),
    );
  }
}
