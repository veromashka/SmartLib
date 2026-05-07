import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'john_doe', minLength: 2, maxLength: 32 })
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  login: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd!', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt hard limit
  password: string;

  /**
   * Optional. In production this should be ignored / forbidden for self-signup
   * — only ADMINs should be able to elevate roles.
   */
  @ApiProperty({ enum: Role, required: false, default: Role.READER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
