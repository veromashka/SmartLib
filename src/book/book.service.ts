import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookRequestDto } from './dto/request/create-book.dto';
import { UpdateBookRequestDto } from './dto/request/update-book.dto';

@Injectable()
export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async create(data: CreateBookRequestDto) {
    try {
      const { title, author, releaseYear, category, genres } = data;

      const create = genres.map((genre) => {
        return {
          genre: {
            connect: {
              id: genre,
            },
          },
        };
      });

      // TODO: get all genres and map them to know where id of genre is sane with genreId in book input
      return await this.bookRepository.create({
        title,
        author,
        releaseYear,
        category,
        genre: {
          create,
        },
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getAll() {
    return await this.bookRepository.findAll();
  }

  //TODO
  async update(id: string, data: UpdateBookRequestDto) {
    try {
      return await this.bookRepository.update(id, data);
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async deleteById(id: string) {
    try {
      return await this.bookRepository.delete({ id: id });
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
