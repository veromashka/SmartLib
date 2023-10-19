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
import constants from '../shared/util/constants';
import { newExpDate } from '../shared/util/date';
import { AuthRequestDto, SecretNumberDto } from './dto/request';
import { ConfigService } from '@nestjs/config';
import { LoginResponseDto } from './dto/response/login.dto';
import { SignupResponseDto } from './dto/response/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private mailService: EmailService,
    private authRepository: AuthRepository,
    private jwtService: JwtService
  ) {}

  async signUp(data: CreateUserDto): Promise<SignupResponseDto> {
    try {
      const { login, email, password } = data;

      const user = await this.userService.findByEmail(email);
      const confirmationNumber = await this.generateSecretNumber();
      if (user && !user.confirmationStatus) {
        await this.userService.update(user.id, data);
        return await this.checkExpireDate(user, confirmationNumber);
      }
      const hashedPassword = await this.hashPassword(password);

      const newExpTime = await newExpDate(constants.durationString);
      console.log(newExpTime);
      const createdUser = await this.authRepository.signUp({
        login,
        email,
        confirmationNumber,
        expireDate: new Date(newExpTime).toISOString(),
        password: hashedPassword,
      });

      await this.mailService.sendEmail(email, confirmationNumber);

      return { createdUser };
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

      if (user.confirmationNumber !== data.secretNumber) {
        throw new BadRequestException('Secret number is incorrect');
      }

      return await this.userService.update(user.id, {
        ...user,
        confirmationStatus: true,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async logIn(data: AuthRequestDto): Promise<LoginResponseDto> {
    try {
      const user = await this.userService.findByEmail(data.email);

      if (!user || !user.confirmationStatus) {
        throw new NotFoundException('Wrong email or password');
      }

      await this.comparePassword(data.password, user.password);

      const accessToken = await this.signToken(user);

      return { accessToken };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async checkExpireDate(
    user: Users,
    token: number
  ): Promise<{ message: string }> {
    try {
      const userExpireDate = new Date(user.expireDate).getTime();
      const currDate = new Date(
        constants.currentDate.format(constants.dayFormat)
      ).getTime();

      if (userExpireDate <= currDate) {
        await this.mailService.sendEmail(user.email, token);
      }

      return {
        message: 'Email with secret code was sent ',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async generateSecretNumber(): Promise<number> {
    return Math.floor(
      Math.random() * (constants.maxNumber - constants.minNumber) +
        constants.minNumber
    );
  }

  async signToken(user: Users): Promise<string> {
    const payload = {
      sub: user.email,
      id: user.id,
    };
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    return this.jwtService.sign(payload, { secret: jwtSecret });
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const result = await bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new BadRequestException('Password or email is incorrect');
    }
    return result;
  }
}
