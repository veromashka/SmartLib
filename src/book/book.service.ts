import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookRequestDto } from './dto/request';
import { UpdateBookRequestDto } from './dto/request';
import { Books } from '@prisma/client';

@Injectable()
export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async create(data: CreateBookRequestDto): Promise<Books> {
    try {
      const { title, author, releaseYear, category, genres, price } = data;

      const create = genres.map((genre) => {
        return {
          genre: {
            connect: {
              id: genre,
            },
          },
        };
      });

      return await this.bookRepository.create({
        price,
        title,
        author,
        releaseYear,
        category,
        genre: {
          create,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<Books[]> {
    return await this.bookRepository.findAll();
  }

  async getById(id: string): Promise<Books> {
    return await this.bookRepository.findOne({ id });
  }

  async update(id: string, data: UpdateBookRequestDto): Promise<Books> {
    try {
      return await this.bookRepository.update(id, data);
    } catch (e) {
      throw new BadRequestException(e.message, {
        cause: new Error(),
      });
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.bookRepository.delete({ id: id });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
