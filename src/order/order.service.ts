import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/request/create-order';
import { OrderRepository } from './order.repository';
import { BookService } from '../book/book.service';
import { Orders, Users } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private bookService: BookService
  ) {}

  async createNew(data: CreateOrderDto, user: Users): Promise<Orders> {
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
          id: user.id,
        },
      },
      books: { create },
    });
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
