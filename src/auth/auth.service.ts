import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';
import { CreateUserDto } from '../user/dto/request/create-user.dto';
import { AuthRepository } from './auth.repository';
import { EmailService } from '../mail/mail.service';
import { durationString, newExpDate } from '../shared/util/constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: EmailService,
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(data: CreateUserDto) {
    try {
      const { login, role, email, confirmationStatus, password } = data;

      // const user = await this.isEmailExist(data);
      //
      // if (user) {
      //   console.log('erroe');
      //   const message = 'User already exists';
      //   throw new BadRequestException(message);
      // }

      const newPassword = await this.hashPassword(password);
      const token = await this.generateSecretNumber();

      const newExpTime = await newExpDate(durationString);

      const newUser = await this.authRepository.signUp({
        login,
        role,
        email,
        confirmationNumber: token,
        confirmationStatus,
        expireDate: newExpTime.toString(),
        password: newPassword,
      });

      await this.mailService.sendEmail(email, token);

      return newUser;
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Something bad happened');
    }
  }

  // async checkIsEmailConfirmed(secretNumber: number): Promise {}

  async logIn(data) {
    try {
      const user = await this.userService.findByEmail(data.email);

      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      await this.comparePassword(data.password, user.password);

      return {
        access_token: await this.signToken(user),
      };
    } catch (error) {
      throw error;
    }
  }

  async addHours(date: Date, hours: number): Promise<Date> {
    date.setHours(date.getHours() + hours);

    return date;
  }
  async generateSecretNumber(): Promise<number> {
    const minm = 10000;
    const maxm = 99999;
    const secretNumber = Math.floor(Math.random() * (maxm - minm + 1) + minm);
    return secretNumber;
  }
  async signToken(user: Users): Promise<string> {
    const payload = {
      sub: user.email,
      id: user.id,
    };
    return await this.jwtService.sign(payload, { secret: 'SECRET' });
  }
  async isEmailExist(data) {
    const user = await this.userService.findByEmail(data.email);
    return !!user;
  }
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const result = await bcrypt.compare(password, hashedPassword);

    if (!result) {
      const messsage = 'Password is incorrect';
      throw new BadRequestException(messsage);
    }
    return result;
  }
}
