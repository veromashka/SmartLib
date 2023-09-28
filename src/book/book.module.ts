import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
// import { BookService } from './book.service';
import { BookRepository } from './book.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [BookRepository, PrismaService],
  controllers: [BookController],
})
export class BooksModule {}
