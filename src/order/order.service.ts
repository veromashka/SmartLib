import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/request/create-order';
import { OrderRepository } from './order.repository';
import { BookService } from '../book/book.service';
import { Orders, Users } from '@prisma/client';
import { connect } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private bookService: BookService
  ) {}

  async createNew(data: CreateOrderDto, user: Users): Promise<Orders> {
    const { book, term, paid } = data;
    //TODO to fix
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

  async deleteById(id: string) {
    try {
      return await this.orderRepository.delete({ id: id });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
