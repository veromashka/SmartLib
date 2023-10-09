import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Genres as GenresModel } from '@prisma/client';
import { GenreService } from './genre.service';
import { CreateGenreRequestDto } from './dto/request/create-genre.dto';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}
  @Post('new')
  async createGenre(@Body() data: CreateGenreRequestDto): Promise<GenresModel> {
    return this.genreService.createGenre(data);
  }
  @Get('all')
  async getAllGenres(): Promise<GenresModel[]> {
    return await this.genreService.getAll();
  }
  @Get(':id')
  async findById(@Param('id') id: string): Promise<GenresModel> {
    return this.genreService.getById({ id: id });
  }
}
