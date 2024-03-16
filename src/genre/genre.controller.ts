import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { Genres as GenresModel } from '@prisma/client';
import { GenreService } from './genre.service';
import { CreateGenreRequestDto } from './dto/request/create-genre.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('genre')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}
  @Post('new')
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Serveral error.' })
  async createGenre(@Body() data: CreateGenreRequestDto): Promise<GenresModel> {
    return this.genreService.createGenre(data);
  }
  @Get('all')
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 500, description: 'Serveral error.' })
  async getAllGenres(): Promise<GenresModel[]> {
    return await this.genreService.getAll();
  }
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async findById(@Param('id') id: string): Promise<GenresModel> {
    return this.genreService.getById(id);
  }
}
