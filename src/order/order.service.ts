import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/request/create-order';
import { OrderRepository } from './order.repository';
import { BookService } from '../book/book.service';
import { Orders } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private bookService: BookService
  ) {}

  async createNew(data: CreateOrderDto): Promise<Orders> {
    try {
      const { book, term, paid } = data;

      const create = book.map((item) => {
        return {
          book: {
            connect: {
              id: item,
            },
          },
        };
      });

      return await this.orderRepository.create({
        term,
        paid,
        user: {
          connect: {
            id: '8aa90bdd-05dc-4537-bc8b-93d33a5b61c7',
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
