import { Injectable } from '@nestjs/common';
import { CreateGenreRequestDto } from './dto/request';
import { PrismaService } from 'src/prisma.service';
import { Genres } from '@prisma/client';

@Injectable()
export class GenreRepository {
  constructor(private prisma: PrismaService) {}

  async create(createDataBody: CreateGenreRequestDto) {
    return await this.prisma.genres.create({ data: createDataBody });
  }

  async getById(id: string) {
    return await this.prisma.genres.findUnique({ where: { id } });
  }

  async getAll(): Promise<Genres[]> {
    return await this.prisma.genres.findMany();
  }
}
