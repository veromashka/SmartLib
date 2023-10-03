import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Books, Prisma } from '@prisma/client';
// import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(BookService.name);

  async createBook(data: Prisma.BooksCreateInput): Promise<Books> {
    this.logger.log('CREATE NEW BOOK');
    // const genre = this.prisma.genres.getOne() "romance"
    return this.prisma.books.create({
      data,
    });
  }

  async getAllBook(): Promise<Books[]> {
    this.logger.log('GET ALL BOOKS');
    return this.prisma.books.findMany();
  }
}
