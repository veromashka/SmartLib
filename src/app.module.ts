import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './logger/logger.middleware';
import { BooksModule } from './book/book.module';
import { GenreModule } from './genre/genre.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './logger/logger.middleware';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [BooksModule, GenreModule, UserModule, AuthModule, MailModule],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
