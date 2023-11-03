import { PrismaService } from 'src/prisma.service';
import { Orders, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(createDto: Prisma.OrdersCreateInput): Promise<Orders> {
    return this.prisma.orders.create({
      data: createDto,
    });
  }
  async findOne(id: string): Promise<Orders | null> {
    return await this.prisma.orders.findUnique({ where: { id } });
  }
  async findUserInOrder(userId: string): Promise<Orders[] | null> {
    return await this.prisma.orders.findMany({ where: { userId } });
  }
  async findAll(): Promise<Orders[]> {
    return await this.prisma.orders.findMany();
  }
  async update(id: string, updateData: Partial<Orders>): Promise<Orders> {
    return await this.prisma.orders.update({ where: { id }, data: updateData });
  }
  async delete(id: string): Promise<void> {
    await this.prisma.orders.delete({ where: { id } });
  }
}
