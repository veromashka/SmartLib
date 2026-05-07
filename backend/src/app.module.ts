import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { LoggerMiddleware } from './logger/logger.middleware';
import { BooksModule } from './book/book.module';
import { GenreModule } from './genre/genre.module';
import { AuthModule } from './auth/auth.module';
import { BooksParserModule } from './books-parser/books-parser.module';
import { AiModule } from './ai/ai.module';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    // Loaded once, available to every module via dependency injection.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Sensible global rate limit; AI module overrides with stricter @Throttle().
    // `@nestjs/throttler` v4 API: single object, `ttl` in seconds.
    ThrottlerModule.forRoot({ ttl: 60, limit: 60 }),

    AuthModule,
    UsersModule,
    BooksModule,
    GenreModule,
    NotesModule,
    BooksParserModule,
    AiModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
