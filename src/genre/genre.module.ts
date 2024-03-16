import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { PrismaService } from 'src/prisma.service';
import { GenreRepository } from './genre.repository';
import { BooksModule } from '../book/book.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    GenreService,
    BooksModule,
    GenreRepository,
    PrismaService,
    JwtService,
    ConfigService,
  ],
  controllers: [GenreController],
})
export class GenreModule {}
