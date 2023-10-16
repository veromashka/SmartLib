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
import { ConfirmDto } from './dto/request/confirm.dto';
import { SecretNumberDto } from './dto/request/secret-number.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: EmailService,
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  //TODO confirm password
  //Variant 1 user is registered but email is not confirmed> resend confirmation number to email
  //Variant 2 user got secretNumber which is expired> resend confirmation number to email
  //Variant 3 user is registered with confirmed email> Login please
  async signUp(data: CreateUserDto) {
    try {
      const { login, role, email, confirmationStatus, password } = data;

      const user = await this.userService.findByEmail(email);
      const token = await this.generateSecretNumber();

      if (user && !user.confirmationStatus && user.confirmationNumber) {
        const dbDate = new Date(user.expireDate).getTime();
        const currDate = new Date(
          currentDate.format('YYYY-MM-DD HH:mm:ss'),
        ).getTime();
        if (dbDate <= currDate) {
          console.log('Email with secret code was sent again');
          await this.mailService.sendEmail(user.email, token);
          //Redirect to confirm page with user id in params
        } else {
          console.log('Please check your post');
          //Redirect to confirm page with user id in params
        }
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
      console.log(e);
      throw new BadRequestException('Something bad happened');
    }
  }
  async confirmEmail(id: string, data: SecretNumberDto): Promise<Users> {
    try {
      const user = await this.userService.findById(id);

      if (user.confirmationStatus) {
        throw new BadRequestException('This email has already been confirmed');
      } else {
      }

      if (user.confirmationNumber == data.secretNumber) {
        return await this.userService.update(user.id, {
          ...user,
          confirmationStatus: true,
        });
      } else {
        throw new BadRequestException('Secret number is incorrect');
      }
      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  // async checkIsEmailConfirmed(secretNumber: number): Promise {}

  async logIn(data) {
    try {
      const user = await this.userService.findByEmail(data.email);

      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      const token = await this.generateSecretNumber();
      if (!user.confirmationStatus) {
        const dbDate = new Date(user.expireDate).getTime();
        const currDate = new Date(
          currentDate.format('YYYY-MM-DD HH:mm:ss'),
        ).getTime();
        if (dbDate <= currDate) {
          console.log('Email with secret code was sent again');
          await this.mailService.sendEmail(user.email, token);
          //Redirect to confirm page with user id in params
        } else {
          console.log('Please check your post');
          //Redirect to confirm page with user id in params
        }
      }
      await this.comparePassword(data.password, user.password);

      return { access_token: await this.signToken(user) };
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
      const messsage = 'Password or email is incorrect';
      throw new BadRequestException(messsage);
    }
    return result;
  }
}
