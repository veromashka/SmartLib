import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookRequestDto } from './dto/request/create-book.dto';
import { UpdateBookRequestDto } from './dto/request/update-book.dto';
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

    // TODO: add a real order relation here when creating books
    const string = data.genre.map((item) => Object.values(item));
    return await this.bookRepository.create({
      title,
      author,
      releaseYear,
      genre: {
        create: [
          {
            genre: {
              connect: {
                id: string.toString(),
              },
            },
          },
        ],
      },
    } as Prisma.BooksCreateInput);
  }
  async getAll() {
    return await this.bookRepository.findAll();
  }

  async update(id: string, data: UpdateBookRequestDto) {
    // Pick only the fields whose shape matches Prisma directly.
    // `genre` is a relation on the schema and needs a separate sync step,
    // not a plain string[] update — left out here intentionally.
    const updateInput: Prisma.BooksUpdateInput = {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.author !== undefined && { author: data.author }),
      ...(data.releaseYear !== undefined && { releaseYear: data.releaseYear }),
      ...(data.category !== undefined && { category: data.category }),
    };
    return await this.bookRepository.update(id, updateInput);
  }

  async remove(id: string) {
    return await this.bookRepository.delete({ id });
  }
}
