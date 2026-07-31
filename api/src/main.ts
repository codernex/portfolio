// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './core/interceptor/response.interceptor';
import cookieParser from 'cookie-parser';
// import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: [
      'https://codernex.dev',
      'https://www.codernex.dev',
      'http://localhost:3000',
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());

  // API prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
