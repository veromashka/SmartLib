import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { BookService } from '../book/book.service';
import { BookRepository } from '../book/book.repository';

@Module({
  providers: [
    BookService,
    BookRepository,
    OrderService,
    OrderRepository,
    PrismaService,
  ],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
