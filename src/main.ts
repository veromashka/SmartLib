import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLogger } from './logger/logger.service';

(async function () {
  const app = await NestFactory.create(AppModule, {
    logger: new MyLogger(),
  });
  app.setGlobalPrefix('api');

  await app.listen(3000);
})();
