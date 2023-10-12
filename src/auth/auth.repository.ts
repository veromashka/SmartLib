import { PrismaService } from 'src/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async signUp(data: Prisma.UsersCreateInput) {
    return this.prisma.users.create({
      data,
    });
  }
}
