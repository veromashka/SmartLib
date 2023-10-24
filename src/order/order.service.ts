import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/request/create-order';
import { OrderRepository } from './order.repository';
import { BookService } from '../book/book.service';
import { Orders } from '@prisma/client';
import { newExpDate } from '../shared/util/date';
import { UserService } from '../user/user.service';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private bookService: BookService,
    private userService: UserService
  ) {}

  async createNew(id: string, data: CreateOrderDto): Promise<Orders> {
    try {
      const { books, term } = data;

      const create = books.map((item) => {
        return {
          book: {
            connect: {
              id: item,
            },
          },
        };
      });

      const dateOfEnd = await newExpDate(term + 'd');
      return await this.orderRepository.create({
        term,
        paid: false,
        finishDate: new Date(dateOfEnd).toISOString(),
        user: {
          connect: {
            id: id,
          },
        },
        books: { create },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(): Promise<Orders[]> {
    return await this.orderRepository.findAll();
  }

  async getById(id: string): Promise<Orders> {
    return await this.orderRepository.findOne({ id });
  }

  async deleteById(id: string): Promise<void> {
    try {
      return await this.orderRepository.delete({ id: id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
