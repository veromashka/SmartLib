import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseInterceptors,
  Get,
  Param,
  Put,
  Patch,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { AuthService } from './auth.service';
import { AuthRequestDto } from './dto/request/auth.dto';
import { TokenInterceptor } from '../shared/interceptor/token.interceptor';
import { CreateUserDto } from '../user/dto/request/create-user.dto';
import { Users } from '@prisma/client';
import { SecretNumberDto } from './dto/request/secret-number.dto';
import { ConfirmDto } from './dto/request/confirm.dto';

@Controller('auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: CreateUserDto): Promise<Users> {
    return await this.authService.signUp(data);
  }

  @Patch('confirm/:id')
  async confirm(
    @Param('id') id: string,
    @Body() data: SecretNumberDto,
  ): Promise<Users> {
    return await this.authService.confirmEmail(id, { ...data });
  }

  @Post('login')
  @UseInterceptors(TokenInterceptor)
  async login(@Body() data: AuthRequestDto): Promise<{ access_token: string }> {
    return await this.authService.logIn(data);
  }
}
