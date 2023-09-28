import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Genres, Prisma } from '@prisma/client';
// import { Logger, Injectable } from '@nestjs/common';

//1. Logger
//2. Genres model CRUD
// Ask about DTO

//3. User Auth registr token login
//4.boookGenres name fields
//

@Injectable()
export class GenreService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(GenreService.name);

  //CREATE
  async createGenre(data: Prisma.GenresCreateInput): Promise<Genres> {
    this.logger.log('CREATE NEW BOOK');
    // const genre = this.prisma.genres.getOne() "romance"
    return this.prisma.genres.create({
      data,
    });
  }
  //GET ALL
  async getAll(): Promise<Genres[]> {
    this.logger.log('GET ALL BOOKS');
    return this.prisma.genres.findMany();
  }
  //UPDATE
  // async updateGenreByID(params: {
  //   where: Prisma.GenresWhereUniqueInput;
  //   data: Prisma.GenresUpdateInput;
  // }): Promise<Genres[]> {
  //   const { where, data } = params;
  //   this.logger.log('GET ALL BOOKS');
  //   return this.prisma.genres.update(data);
  // }
  // async updatePost(params: {
  //   where: Prisma.PostWhereUniqueInput;
  //   data: Prisma.PostUpdateInput;
  // }): Promise<Post> {
  //   C;
  //   return this.prisma.post.update({
  //     data,
  //     where,
  //   });
  // }
  // //DELETE
  // async deleteGenreById(): Promise<Genres[]> {
  //   this.logger.log('GET ALL BOOKS');
  //   return this.prisma.genres.findMany();
  // }
}
