import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { AuthService } from './auth.service';
import { AuthRequestDto } from './dto/request/auth.dto';
import { TokenInterceptor } from '../shared/interceptor/token.interceptor';

@Controller('auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(TokenInterceptor)
  async createNew(
    @Body() data: AuthRequestDto,
  ): Promise<{ access_token: string }> {
    return await this.authService.signIn(data);
  }
}
