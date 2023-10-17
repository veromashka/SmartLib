import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    AuthService,
    AuthRepository,
    UserRepository,
    UserService,
    EmailService,
    ConfigService,
    JwtService,
    PrismaService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
