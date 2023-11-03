import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BooksOrder } from '@prisma/client';

@Injectable()
export class BookOrderRepository {
  constructor(private prisma: PrismaService) {}
  async getById(orderId: string): Promise<BooksOrder[]> {
    return await this.prisma.booksOrder.findMany({
      where: { orderId },
    });
  }

  async getAll(): Promise<BooksOrder[]> {
    return await this.prisma.booksOrder.findMany();
  }
}
