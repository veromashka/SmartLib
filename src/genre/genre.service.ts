import { Genres } from '@prisma/client';
import { GenreRepository } from './genre.repository';
import { CreateGenreRequestDto } from './dto/request';
import {
  Logger,
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class GenreService {
  constructor(private genreRepository: GenreRepository) {}
  private readonly logger = new Logger(GenreService.name);

  //CREATE
  async createGenre(data: CreateGenreRequestDto): Promise<Genres> {
    try {
      return this.genreRepository.create({ ...data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getById(id: string): Promise<Genres> {
    try {
      return await this.genreRepository.getById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  async getAll(): Promise<Genres[]> {
    try {
      return await this.genreRepository.getAll();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
