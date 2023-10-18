import { Controller, Body, UseFilters, Patch, Param } from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { Users } from '@prisma/client';

@Controller('user')
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto
  ): Promise<Users> {
    return this.userService.update(id, data);
  }
}
