import {
  Controller,
  Post,
  Body,
  UseFilters,
  Patch,
  Param,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { Users } from '@prisma/client';
import { UpdateUserDto } from './dto/request/update-user.dto';

@Controller('user')
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createNew(@Body() data: CreateUserDto): Promise<Users> {
    return this.userService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }
}
