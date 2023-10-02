import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { PrismaService } from 'src/prisma.service';
import { BookRepository } from './book.repository';

@Module({
  providers: [BookService, BookRepository, PrismaService],
  controllers: [BookController],
  exports: [BookService, BookRepository]
})
export class BooksModule {}
