import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    UserService,
    UserRepository,
    PrismaService,
    ConfigService,
    JwtService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
