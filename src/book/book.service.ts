import { Injectable, Logger } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookRequestDto } from './dto/request/create-book.dto';
import { UpdateBookRequestDto } from './dto/request/update-book.dto';
import { Prisma } from '@prisma/client';


@Injectable()
export class BookService {
  constructor(private bookRepository: BookRepository) {}
  // private readonly logger = new Logger(BookService.name);

  async create(data: CreateBookRequestDto){
    // data. get Genres from genreService
    const createData: Prisma.BooksCreateInput = {
      title: data.title,
      author: data.author,
      releaseYear: data.releaseYear

    }
    return await this.bookRepository.create( createData )
  }
  async getAll() {
    return await this.bookRepository.findAll()
  }

  // async update(id: string, data: UpdateBookRequestDto){
  //   return await this.bookRepository.update(id, data)
  // }
}
