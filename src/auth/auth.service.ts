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
import {
  currentDate,
  durationString,
  newExpDate,
} from '../shared/util/constants';
import { SecretNumberDto } from './dto/request/secret-number.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private mailService: EmailService,
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(data: CreateUserDto) {
    try {
      const { login, role, email, confirmationStatus, password } = data;

      const user = await this.userService.findByEmail(email);
      const token = await this.generateSecretNumber();

      const expireResult = await this.checkExpireDate(user, token);
      if (expireResult) {
        return expireResult;
      }
      const newPassword = await this.hashPassword(password);

      const newExpTime = await newExpDate(durationString);

      const newUser = await this.authRepository.signUp({
        login,
        role,
        email,
        confirmationNumber: token,
        confirmationStatus,
        expireDate: new Date(newExpTime).toISOString(),
        password: newPassword,
      });

      await this.mailService.sendEmail(email, token);

      return newUser;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  async confirmEmail(id: string, data: SecretNumberDto): Promise<Users> {
    try {
      const user = await this.userService.findById(id);

      if (user.confirmationStatus) {
        throw new BadRequestException('This email has already been confirmed');
      }

      if (user.confirmationNumber == data.secretNumber) {
        return await this.userService.update(user.id, {
          ...user,
          confirmationStatus: true,
        });
      } else {
        throw new BadRequestException('Secret number is incorrect');
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async logIn(data) {
    try {
      const user = await this.userService.findByEmail(data.email);

      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      const token = await this.generateSecretNumber();
      const expireResult = await this.checkExpireDate(user, token);
      if (expireResult) {
        return expireResult;
      }

      await this.comparePassword(data.password, user.password);

      return { access_token: await this.signToken(user) };
    } catch (error) {
      throw error;
    }
  }

  async checkExpireDate(user: Users, token) {
    try {
      if (user && !user.confirmationStatus) {
        const userExpireDate = new Date(user.expireDate).getTime();
        const currDate = new Date(
          currentDate.format('YYYY-MM-DD HH:mm:ss'),
        ).getTime();
        if (userExpireDate <= currDate) {
          await this.mailService.sendEmail(user.email, token);
          return {
            message: 'Email with secret code was sent again',
            userId: user.id,
          };
        } else {
          return {
            message: 'Please check your post',
            userId: user.id,
          };
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
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
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    return this.jwtService.sign(payload, { secret: jwtSecret });
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
      const messsage = 'Password or email is incorrect';
      throw new BadRequestException(messsage);
    }
    return result;
  }
}
