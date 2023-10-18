import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { PrismaService } from 'src/prisma.service';
import { GenreRepository } from './genre.repository';
import { BooksModule } from '../book/book.module';

@Module({
  providers: [GenreService, BooksModule, GenreRepository, PrismaService],
  controllers: [GenreController],
})
export class GenreModule {}
