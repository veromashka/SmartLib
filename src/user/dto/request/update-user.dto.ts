import { UserDto } from './user.dto';
import { IsArray, IsObject, IsOptional } from 'class-validator';

export class UpdateUserDto extends UserDto {
  @IsOptional()
  login: string;

  @IsOptional()
  email: string;

  @IsOptional()
  password: string;
}
