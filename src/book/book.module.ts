import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { PrismaService } from 'src/prisma.service';
import { BookRepository } from './book.repository';
import { GenreService } from '../genre/genre.service';
import { GenreRepository } from "../genre/genre.repository";

@Module({
  providers: [BookService , GenreService, GenreRepository, BookRepository, PrismaService],
  controllers: [BookController],
  exports: [BookService, BookRepository]
})
export class BooksModule {}
