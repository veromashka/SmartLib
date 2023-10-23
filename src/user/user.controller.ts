import { Controller, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { Users } from '@prisma/client';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto
  ): Promise<Users> {
    return this.userService.update(id, data);
  }
}
