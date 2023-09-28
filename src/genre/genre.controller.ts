import { Controller, Get, Post, Body } from '@nestjs/common';
import { Genres as GenresModel } from '@prisma/client';
import { GenreService } from './genre.service';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  // @Post('post')
  // async createGenre(
  //   @Body()
  //   postData: {
  //     title: string;
  //     author: string;
  //     genre: string;
  //     releaseYear: number;
  //   },
  // ): Promise<GenresModel> {
  //   const { title, author, releaseYear } = postData;
  //   return this.genreService.createGenre({
  //     title,
  //     author,
  //     releaseYear,
  //   });
  // }

  @Get('all')
  async getAllGenres(): Promise<GenresModel[]> {
    return this.genreService.getAll();
  }
}
