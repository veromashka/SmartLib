import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { AuthService } from './auth.service';
import { AuthRequestDto } from './dto/request/auth.dto';
import { TokenInterceptor } from '../shared/interceptor/token.interceptor';
import { CreateUserDto } from '../user/dto/request/create-user.dto';
import { Users } from '@prisma/client';
import { SecretNumberDto } from './dto/request/secret-number.dto';

@Controller('auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: CreateUserDto): Promise<Users> {
    return await this.authService.signUp(data);
  }
  // @Get('confirmation/check')
  // async checkSecretNumber(@Body() data: SecretNumberDto): Promise<Users> {
  //   return await this.authService.checkIsEmailConfirmed(data);
  // }
  @Post('login')
  @UseInterceptors(TokenInterceptor)
  async login(@Body() data: AuthRequestDto): Promise<{ access_token: string }> {
    return await this.authService.logIn(data);
  }
}
