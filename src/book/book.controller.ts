import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Books as BookModel } from '@prisma/client';
import { CreateBookRequestDto } from './dto/request/create-book.dto';
import { BookService } from './book.service';
import { UpdateBookRequestDto } from './dto/request/update-book.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('book')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('new')
  @ApiResponse({ status: 201, description: 'Created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async createBook(@Body() data: CreateBookRequestDto): Promise<BookModel> {
    return this.bookService.create(data);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 401, description: 'Unatorized.' })
  @ApiResponse({ status: 500, description: 'Serveral Error.' })
  async findAll(): Promise<BookModel[]> {
    return this.bookService.getAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async findById(@Param('id') id: string): Promise<BookModel> {
    return this.bookService.getById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Updated.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateBookRequestDto
  ): Promise<BookModel> {
    return this.bookService.update(id, data);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.bookService.deleteById(id);
  }
}
