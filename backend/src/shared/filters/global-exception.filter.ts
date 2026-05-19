import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ZodError } from 'zod';

import { AppError, ValidationAppError } from '../errors/app-error';

interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    detail?: unknown;
  };
}

interface HttpResponse {
  status(code: number): {
    json(body: ApiErrorBody): void;
  };
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<HttpResponse>();
    const appError = this.toAppError(exception);
    const body: ApiErrorBody = {
      success: false,
      error: {
        code: appError.code,
        message: appError.message,
      },
    };

    if (process.env.NODE_ENV !== 'production' && appError.detail !== undefined) {
      body.error.detail = appError.detail;
    }

    response.status(appError.statusCode).json(body);
  }

  private toAppError(exception: unknown): AppError {
    if (exception instanceof AppError) {
      return exception;
    }

    if (exception instanceof ZodError) {
      return new ValidationAppError(exception.flatten());
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const detail = typeof response === 'string' ? response : response;
      return new AppError(
        'HTTP_ERROR',
        exception.message,
        exception.getStatus(),
        detail,
      );
    }

    const detail = exception instanceof Error ? exception.stack : exception;
    return new AppError(
      'INTERNAL_SERVER_ERROR',
      'เกิดข้อผิดพลาดในระบบ',
      HttpStatus.INTERNAL_SERVER_ERROR,
      detail,
    );
  }
}
