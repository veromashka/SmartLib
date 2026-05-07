import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

/**
 * Public-facing user shape. Mirrors the fields returned by the
 * `users.service.publicSelect` Prisma `select` — password is NEVER included.
 */
export class UserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() login: string;
  @ApiProperty() email: string;
  @ApiProperty({ enum: Role }) role: Role;
  @ApiProperty() createdAt: Date;
  @ApiProperty({ required: false, nullable: true }) deletedAt: Date | null;
}
