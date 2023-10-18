import { Genres } from '@prisma/client';
import { GenreRepository } from './genre.repository';
import { CreateGenreRequestDto } from './dto/request';
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class GenreService {
  constructor(private genreRepository: GenreRepository) {}
  private readonly logger = new Logger(GenreService.name);

  //CREATE
  async createGenre(data: CreateGenreRequestDto): Promise<Genres> {
    return this.genreRepository.create({ ...data });
  }
  async getById(id: string): Promise<Genres> {
    return await this.genreRepository.getById(id);
  }
  async getAll(): Promise<Genres[]> {
    return await this.genreRepository.getAll();
  }
  //TODO
  // async deleteGenreById(): Promise<Genres[]> {
  //   this.logger.log('GET ALL BOOKS');
  //   return this.prisma.genres.findMany();
  // }
}
