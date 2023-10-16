import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
      // await this.logger.log('POST');
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
      // this.logger.error(e);
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Some error description',
      });
    }
  }

  async getAll() {
    // this.logger.log('GET ALL');
    return await this.bookRepository.findAll();
  }

  //TODO
  async getById(id: string) {
    return await this.bookRepository.findOne({ id });
  }

  async update(id: string, data: UpdateBookRequestDto) {
    try {
      return await this.bookRepository.update(id, data);
    } catch (e) {
      throw new BadRequestException(e.message, {
        cause: new Error(),
      });
    }
  }
  async deleteById(id: string) {
    try {
      return await this.bookRepository.delete({ id: id });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
