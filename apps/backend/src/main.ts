import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = app.get(ConfigService);
  const origin = config.get<string>('CORS_ORIGIN') ?? 'http://localhost:5173';
  app.enableCors({ origin: origin.split(','), credentials: true });

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`Leave Management API running on http://localhost:${port}/api`);
}
void bootstrap();
