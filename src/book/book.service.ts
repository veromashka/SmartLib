import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookRequestDto } from './dto/request/create-book.dto';
import { GenreService } from '../genre/genre.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookService {
  constructor(
    private bookRepository: BookRepository,
    private genreService: GenreService,
  ) {}

  async create(data: CreateBookRequestDto) {
    const { title, author, releaseYear, genre } = data;

    // TODO: get all genres and map them to know where id of genre is sane with genreId in book input
    const string = data.genre.map((item) => Object.values(item));
    return await this.bookRepository.create({
      title,
      author,
      releaseYear,
      genre: {
        // this creates new row in `UsersInvestments`
        create: [
          {
            // Here we say that this new row user will be one of existing users
            genre: {
              connect: {
                id: string.toString(),
              },
            },
          },
        ],
      },
    });
  }
  async getAll() {
    return await this.bookRepository.findAll();
  }
  //TODO
  // async update(id: string, data: UpdateBookRequestDto){
  //   return await this.bookRepository.update(id, data)
  // }
}
