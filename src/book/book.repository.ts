import { PrismaService } from 'src/prisma.service';
import { Books, Prisma } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BookRepository {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(BookRepository.name);

  async create(data: Prisma.BooksCreateInput): Promise<Books> {
    return await this.prisma.books.create({ data });
  }
  async findOne(id: Prisma.BooksWhereUniqueInput): Promise<Books | null> {
    return await this.prisma.books.findUnique({ where: id });
  }
  async findAll(): Promise<Books[]> {
    return await this.prisma.books.findMany();
  }
  async updateByid(params: {
    where: Prisma.BooksWhereUniqueInput;
    data: Prisma.BooksUpdateInput;
  }): Promise<Books> {
    const { data, where } = params;
    return await this.prisma.books.update({ data, where });
  }
  async deleteByid(where: Prisma.BooksWhereUniqueInput): Promise<Books> {
    return await this.prisma.books.delete({ where });
  }
}
