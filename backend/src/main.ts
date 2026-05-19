import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { ApiResponseInterceptor } from './shared/interceptors/api-response.interceptor';
import { RequestSanitizationPipe } from './shared/pipes/request-sanitization.pipe';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);

  app.useLogger(logger);
  app.enableCors({
    credentials: true,
    origin: true,
  });
  app.useGlobalPipes(new RequestSanitizationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ApiResponseInterceptor());

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  logger.log(`Wellness backend listening on port ${port}`);
}

void bootstrap();
