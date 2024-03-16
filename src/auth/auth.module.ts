import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UserRepository } from '../user/user.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EmailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt-strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import * as process from 'process';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '20h' },
    }),
  ],
  providers: [
    AuthService,
    AuthRepository,
    UserRepository,
    UserService,
    EmailService,
    ConfigService,
    JwtService,
    PrismaService,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
