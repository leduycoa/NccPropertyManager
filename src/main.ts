import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, LogLevel, ValidationPipe } from '@nestjs/common';
import { LoggerInterceptor } from './utils/logging.interceptor';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const logLevels: LogLevel[] = isProduction
  ? ['error', 'warn', 'log']
  : ['error', 'warn', 'log', 'debug', 'verbose'];
  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());
  await app.listen(process.env.PORT);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
 
  app.useGlobalInterceptors(new LoggerInterceptor());
}
bootstrap();
