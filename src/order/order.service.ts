import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/request/create-order';
import { OrderRepository } from './order.repository';
import { BookService } from '../book/book.service';
import { Orders } from '@prisma/client';
import { newExpDate } from '../shared/util/date';
import { UserService } from '../user/user.service';
import constants from '../shared/util/constants';
import { EmailService } from '../mail/mail.service';
import { BookOrderService } from '../bookOrder/bookOrder.service';
import { indexOf } from 'lodash';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private bookService: BookService,
    private mailService: EmailService,
    private booksOrderService: BookOrderService,
    private userService: UserService
  ) {}

  async createNew(id: string, data: CreateOrderDto): Promise<Orders> {
    try {
      const { books, term } = data;

      const create = books.map((item) => {
        return {
          books: {
            connect: {
              id: item,
            },
          },
        };
      });

      const dateOfEnd = await newExpDate(term + 'd');
      const newOrder = await this.orderRepository.create({
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

      return newOrder;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(): Promise<any> {
    const orders = await this.orderRepository.findAll();

    const tommorowDate = await newExpDate('1d');
    const filteredOrders = orders.filter(
      (item) => item.finishDate.getDate() === new Date(tommorowDate).getDate()
    );
    let objectForEmail = [];

    await Promise.all(
      filteredOrders.map(async (item) => {
        const userInfo = await this.userService
          .findById(item.userId)
          .then((res) => {
            return { email: res.email, login: res.login };
          })
          .catch((e) => console.log(e.message));
        const orderInfo = await this.booksOrderService
          .getById(item.id)
          .then((res) => {
            return res;
          })
          .catch((e) => console.log(e.message));
        objectForEmail.push({
          finishDate: item.finishDate,
          userId: item.userId,
          userInfo,
          orderInfo,
          orderId: item.id,
        });

        // await this.mailService.sendEmail({});
        // return objectForEmail;
      })
    );

    await this.mailService.sendEmail({});

    objectForEmail.map((item) => {
      //TODO extract bookTitle
      this.mailService.sendEmail({
        finishDate: item.finishDate,
        email: item.email,
        login: item.login,
      });
    });
    return objectForEmail;
  }

  async getById(id: string): Promise<Orders> {
    return await this.orderRepository.findOne(id);
  }

  async deleteById(id: string): Promise<void> {
    try {
      return await this.orderRepository.delete({ id: id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
