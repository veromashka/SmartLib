import { BooksOrder } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BookOrderRepository } from './bookOrder.repository';
import { BookService } from '../book/book.service';

@Injectable()
export class BookOrderService {
  constructor(
    private bookOrderRepository: BookOrderRepository,
    private bookService: BookService
  ) {}

  async getById(orderId: string): Promise<any> {
    try {
      const booksInOrder = await this.bookOrderRepository.getById(orderId);

      const filteredArr = Promise.all(
        booksInOrder.map(async (item) => {
          const bookTitle = await this.bookService
            .getById(item.bookId)
            .then((res) => {
              return { title: res.title };
            })
            .catch((error) => {
              return error.message;
            });
          return bookTitle;
        })
      );

      return filteredArr;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getAll(): Promise<BooksOrder[]> {
    try {
      return await this.bookOrderRepository.getAll();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
