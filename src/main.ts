import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLogger } from './logger/logger.service';
import { ValidationPipe } from '@nestjs/common';

(async function () {
  const app = await NestFactory.create(AppModule, {
    logger: new MyLogger(),
  });
  app.setGlobalPrefix('api');

  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
})();
