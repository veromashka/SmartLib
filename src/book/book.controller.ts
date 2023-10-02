import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put
} from "@nestjs/common";
import { Books as BookModel } from "@prisma/client";
import { CreateBookRequestDto } from "./dto/request/create-book.dto";
import { BookService } from "./book.service";
import { UpdateBookRequestDto } from "./dto/request/update-book.dto";

@Controller("book")
export class BookController {
  constructor(private readonly bookService: BookService) {
  }

  @Post("new")
  async createBook(
    @Body() data: CreateBookRequestDto): Promise<BookModel> {
    return this.bookService.create(data);
  }

  // @Get('/all')
  // async findAll(): Promise<BookModel[]> {
  //   return this.bookService.getAll();
  // }
  @Get("all")
  async findAll(): Promise<BookModel[]> {
    return this.bookService.getAll();
  }

  // @Get(':id')
  // async findById(@Param('id') id: string): Promise<BookModel> {
  //   return this.bookRepository.findOne({ id: id });
  // }
  // //TODO: change data type

  // @Put(':id')
  // async update(@Param('id') id: string, @Body() data: UpdateBookRequestDto ): Promise<BookModel> {
  //   return this.bookService.update(id, data);
  // }

  // @Delete(':id')
  // async deletePost(@Param('id') id: string): Promise<BookModel> {
  //   return this.bookRepository.delete({ id: id });
  // }
}
