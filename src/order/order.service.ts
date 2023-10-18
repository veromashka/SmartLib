import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/request/create-order';
import { OrderRepository } from './order.repository';
import { BookService } from '../book/book.service';
import { Users } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private bookService: BookService,
  ) {}

  async createNew(data: CreateOrderDto, user: Users) {
    const { book, term, paid } = data;

    const create = book.map((item) => {
      return {
        books: {
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

  //TODO: return Type
  async getAll() {
    // this.logger.log('GET ALL');
    return await this.orderRepository.findAll();
  }

  //TODO: return Type
  async getById(id: string) {
    return await this.orderRepository.findOne({ id });
  }

  //TODO: return Type
  async deleteById(id: string) {
    try {
      return await this.orderRepository.delete({ id: id });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
