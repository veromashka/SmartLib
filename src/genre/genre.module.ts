import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [GenreService, PrismaService],
  controllers: [GenreController],
})
export class BooksModule {}
