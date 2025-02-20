import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // remove object that are not in the DTO
      forbidNonWhitelisted: false, // playload specific and error it is not on the norm
      disableErrorMessages: false, // disable detailed error messages interested in production
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
