import { PrismaService } from 'src/prisma.service';
import { Books, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookRepository {
  constructor(private prisma: PrismaService) {}

  async create(createDto: Prisma.BooksCreateInput): Promise<Books> {
    return this.prisma.books.create({
      data: createDto,
    });
  }
  async findOne(id: Prisma.BooksWhereUniqueInput): Promise<Books | null> {
    return await this.prisma.books.findUnique({ where: id });
  }
  async findAll(): Promise<Books[]> {
    return await this.prisma.books.findMany();
  }
  async update(id: string, updateData: Partial<Books>): Promise<Books> {
    return await this.prisma.books.update({ where: { id }, data: updateData });
  }
  async delete(where: Prisma.BooksWhereUniqueInput): Promise<Books> {
    return await this.prisma.books.delete({ where });
  }
}
