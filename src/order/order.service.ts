import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/request/create-order';
import { OrderRepository } from './order.repository';
import { Orders } from '@prisma/client';
import { newExpDate } from '../shared/util/date';
import { UserService } from '../user/user.service';
import { EmailService } from '../mail/mail.service';
import { BookOrderService } from '../bookOrder/bookOrder.service';
import constants from '../shared/util/constants';
import { MyLogger } from '../modules/logger/logger.service';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private loggerService: MyLogger,
    private mailService: EmailService,
    private booksOrderService: BookOrderService,
    private userService: UserService
  ) {}

  async createNew(id: string, data: CreateOrderDto): Promise<Orders> {
    try {
      const user = await this.getUserById(id);

      if (user.length >= 5) {
        throw new InternalServerErrorException(
          'Sorry order limit is reached for you'
        );
      }
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
    this.loggerService.log('CRON- REMINDER ABOUT EXPIRE ORDERS');
    const orders = await this.orderRepository.findAll();

    const tommorowDate = await newExpDate('1d');
    const filteredOrders = orders.filter(
      (item) => item.finishDate.getDate() === new Date(tommorowDate).getDate()
    );
    const objectForEmail = [];

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
      })
    );

    objectForEmail.map((item) => {
      this.mailService.sendEmail({
        finishDate: item.finishDate,
        email: item.userInfo.email,
        login: item.userInfo.login,
        bookTitle: item.orderInfo,
        type: 'notification',
      });
    });

    return objectForEmail;
  }

  async getById(id: string): Promise<Orders> {
    return await this.orderRepository.findOne(id);
  }
  async getUserById(userId: string): Promise<Orders[]> {
    return await this.orderRepository.findUserInOrder(userId);
  }

  async deleteOrders(): Promise<any> {
    try {
      const orders = await this.orderRepository.findAll();

      const todayDate = constants.currentDate.toISOString();

      Promise.all(
        orders.map(async (item) => {
          if (item.finishDate.getDate() < new Date(todayDate).getDate()) {
            await this.orderRepository.delete(item.id);
          }
        })
      );

      return { message: 'Order list successfuly updated' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
