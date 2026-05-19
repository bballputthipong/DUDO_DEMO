import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

interface DataWithMeta<T> {
  data: T;
  meta: Record<string, unknown>;
}

function hasMeta<T>(value: T | DataWithMeta<T>): value is DataWithMeta<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'meta' in value &&
    typeof (value as { meta: unknown }).meta === 'object'
  );
}

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor<unknown, ApiResponse<unknown>> {
  intercept(_context: ExecutionContext, next: CallHandler<unknown>): Observable<ApiResponse<unknown>> {
    return next.handle().pipe(
      map((value: unknown) => {
        if (hasMeta(value)) {
          return {
            success: true,
            data: value.data,
            meta: value.meta,
          };
        }

        return {
          success: true,
          data: value,
        };
      }),
    );
  }
}
