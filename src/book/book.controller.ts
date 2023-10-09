import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseFilters,
} from '@nestjs/common';
import { Books as BookModel } from '@prisma/client';
import { CreateBookRequestDto } from './dto/request/create-book.dto';
import { BookService } from './book.service';
import { UpdateBookRequestDto } from './dto/request/update-book.dto';
import { HttpExceptionFilter } from '../http-exception.filter';

@Controller('book')
@UseFilters(new HttpExceptionFilter())
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('new')
  async createBook(@Body() data: CreateBookRequestDto): Promise<BookModel> {
    return this.bookService.create(data);
  }

  @Get('all')
  async findAll(): Promise<BookModel[]> {
    return this.bookService.getAll();
  }
  // //TODO: GET by ID
  @Get(':id')
  async findById(@Param('id') id: string): Promise<BookModel> {
    return this.bookService.getById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateBookRequestDto,
  ): Promise<BookModel> {
    return this.bookService.update(id, data);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<BookModel> {
    return this.bookService.deleteById(id);
  }
}
