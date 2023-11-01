import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { BookService } from '../book/book.service';
import { BookRepository } from '../book/book.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailService } from '../mail/mail.service';
import { BookOrderService } from '../bookOrder/bookOrder.service';
import { BookOrderRepository } from '../bookOrder/bookOrder.repository';

@Module({
  providers: [
    BookService,
    BookRepository,
    UserService,
    UserRepository,
    OrderService,
    OrderRepository,
    PrismaService,
    JwtService,
    ConfigService,
    EmailService,
    BookOrderService,
    BookOrderRepository,
  ],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
