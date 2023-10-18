import { PrismaService } from 'src/prisma.service';
import { Orders, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(createDto: Prisma.OrdersCreateInput) {
    return this.prisma.orders.create({
      data: createDto,
    });
  }
  async findOne(id: Prisma.OrdersWhereUniqueInput): Promise<Orders | null> {
    return await this.prisma.orders.findUnique({ where: id });
  }
  async findAll(): Promise<Orders[]> {
    return await this.prisma.orders.findMany();
  }
  async update(id: string, updateData: Partial<Orders>) {
    return await this.prisma.orders.update({ where: { id }, data: updateData });
  }
  async delete(where: Prisma.OrdersWhereUniqueInput): Promise<Orders> {
    return await this.prisma.orders.delete({ where });
  }
}