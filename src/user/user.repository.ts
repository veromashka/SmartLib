import { PrismaService } from 'src/prisma.service';
import { Users, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<Users | null> {
    return await this.prisma.users.findUnique({ where: { email } });
  }

  async findOneById(id: string): Promise<Users | null> {
    return await this.prisma.users.findUnique({ where: { id } });
  }

  async findAll(): Promise<Users[]> {
    return await this.prisma.users.findMany();
  }

  async update(id: string, data: Partial<Users>): Promise<Users> {
    return await this.prisma.users.update({ where: { id }, data });
  }

  async delete(where: Prisma.UsersWhereUniqueInput): Promise<Users> {
    return await this.prisma.users.delete({ where });
  }
}
