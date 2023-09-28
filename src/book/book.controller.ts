import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { Books as BookModel } from '@prisma/client';
// import { BookService } from './book.service';
import { BookRepository } from './book.repository';

@Controller('book')
export class BookController {
  constructor(private readonly bookRepository: BookRepository) {}

  @Post('/')
  async createBook(
    @Body()
    postData: {
      title: string;
      author: string;
      genre: string;
      releaseYear: number;
    },
  ): Promise<BookModel> {
    const { title, author, releaseYear } = postData;
    return this.bookRepository.create({
      title,
      author,
      releaseYear,
    });
  }

  @Get('/all')
  async findAll(): Promise<BookModel[]> {
    return this.bookRepository.findAll();
  }
  @Get(':id')
  async findById(@Param('id') id: string): Promise<BookModel> {
    console.log(id);
    return this.bookRepository.findOne({ id: id });
  }

  // @Put(':id')
  // async publishPost(@Param('id') id: string): Promise<BookModel> {
  //   return this.bookRepository.updateByid({
  //     data,
  //     where: {id:id},
  //   });
  // }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<BookModel> {
    return this.bookRepository.deleteByid({ id: id });
  }
}
