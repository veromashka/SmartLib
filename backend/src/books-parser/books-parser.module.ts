import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BooksParserController } from './books-parser.controller';
import { BooksParserService } from './books-parser.service';
import { GoogleBooksProvider } from './providers/google-books.provider';
import { OpenLibraryProvider } from './providers/open-library.provider';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 8000,
      maxRedirects: 3,
    }),
    // In-memory cache by default. For multi-instance deploys swap the store
    // for `cache-manager-redis-yet`.
    CacheModule.register({
      ttl: 60 * 60 * 1000, // 1h
      max: 1000,
    }),
  ],
  controllers: [BooksParserController],
  providers: [BooksParserService, GoogleBooksProvider, OpenLibraryProvider],
  exports: [BooksParserService],
})
export class BooksParserModule {}
