import { PrismaService } from 'src/prisma.service';
import { Users, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UsersCreateInput) {
    return this.prisma.users.create({
      data,
    });
  }
  async findOne(email: string): Promise<Users | null> {
    return await this.prisma.users.findUnique({ where: { email } });
  }
  async findAll(): Promise<Users[]> {
    return await this.prisma.users.findMany();
  }
  //TODO updateDTO
  // async update(id: string, updateData: ) {
  //   return await this.prisma.books.update({ where: { id }, data: updateData });
  // }
  async delete(where: Prisma.UsersWhereUniqueInput): Promise<Users> {
    return await this.prisma.users.delete({ where });
  }
}
