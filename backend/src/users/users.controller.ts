import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UsersService } from './users.service';
import { ListUsersQueryDto } from './dto/list-users.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'List users (ADMIN, MANAGER)' })
  @ApiOkResponse({ description: 'Paginated list of users (no passwords)' })
  findAll(
    @Query() query: ListUsersQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.usersService.findAll(query);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a user (ADMIN only)' })
  @ApiNoContentResponse({ description: 'User soft-deleted' })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() current: JwtPayload,
  ): Promise<void> {
    await this.usersService.softDelete(id, current.sub);
  }
}
