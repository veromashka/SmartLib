import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BooksModule } from './book/book.module';
import { GenreModule } from './genre/genre.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './logger/logger.middleware';

@Module({
  imports: [BooksModule, GenreModule],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
