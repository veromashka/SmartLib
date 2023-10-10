import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { Prisma, Users } from '@prisma/client';

@Controller('user')
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createNew(@Body() data: CreateUserDto): Promise<Users> {
    return this.userService.create(data);
  }
}
