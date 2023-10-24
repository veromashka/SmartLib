import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Param,
  Patch,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequestDto } from './dto/request/auth.dto';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { CreateUserDto } from '../user/dto/request/create-user.dto';
import { Users } from '@prisma/client';
import { SecretNumberDto } from './dto/request/secret-number.dto';
import { LoginResponseDto } from './dto/response/login.dto';
import { SignupResponseDto } from './dto/response/signup.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({ status: 201, description: 'Created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async signup(@Body() data: CreateUserDto): Promise<SignupResponseDto> {
    return await this.authService.signUp(data);
  }

  @Patch('confirm/:id')
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async confirm(
    @Param('id') id: string,
    @Body() data: SecretNumberDto
  ): Promise<Users> {
    return await this.authService.confirmEmail(id, data);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UseInterceptors(TokenInterceptor)
  async login(
    @Body() data: AuthRequestDto
  ): Promise<{ access_token: string } | object> {
    return await this.authService.logIn(data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @Get('profile')
  async getProfile(@Request() req): Promise<any> {
    return req.user;
  }
}
