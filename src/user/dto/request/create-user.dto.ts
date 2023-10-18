import { UserDto } from './user.dto';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Roles } from '../../../common/enums';

export class CreateUserDto extends UserDto {
  @IsNotEmpty()
  login: string;

  //TODO: remove
  @IsOptional()
  @IsEnum(Roles)
  role: Roles;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  //TODO: remove
  @IsOptional()
  confirmationStatus: boolean;

  @IsOptional()
  confirmationNumber: number;
}
