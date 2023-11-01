import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookRequestDto } from './dto/request';
import { UpdateBookRequestDto } from './dto/request';
import { Books } from '@prisma/client';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async create(data: CreateBookRequestDto): Promise<Books> {
    try {
      const { title, author, releaseDate, category, genres, price, currency } =
        data;

      const editedDate = new Date(releaseDate);

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
        currency,
        category,
        releaseDate: editedDate,
        genre: {
          create,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<Books[]> {
    try {
      return await this.bookRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
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
