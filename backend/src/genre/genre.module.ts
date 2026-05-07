import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { PrismaService } from 'src/prisma.service';
import { GenreRepository } from './genre.repository';

@Module({
  providers: [GenreService, GenreRepository, PrismaService],
  controllers: [GenreController],
})
export class GenreModule {}
