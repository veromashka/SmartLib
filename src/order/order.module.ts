import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { BookService } from '../book/book.service';
import { BookRepository } from '../book/book.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    BookService,
    BookRepository,
    OrderService,
    OrderRepository,
    PrismaService,
    JwtService,
    ConfigService,
  ],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
