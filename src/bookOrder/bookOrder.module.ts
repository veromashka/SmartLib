import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BookOrderController } from './bookOrder.controller';
import { BookOrderRepository } from './bookOrder.repository';
import { ConfigService } from '@nestjs/config';
import { BookOrderService } from './bookOrder.service';
import { BookService } from '../book/book.service';
import { BookRepository } from '../book/book.repository';

@Module({
  providers: [
    BookOrderRepository,
    PrismaService,
    BookOrderService,
    BookService,
    BookRepository,
    ConfigService,
    JwtService,
  ],
  controllers: [BookOrderController],
})
export class BookOrderModule {}
