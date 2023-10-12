import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsArray,
  IsObject,
} from 'class-validator';
import { Roles } from 'src/common/enums';

export class UserDto {
  @IsString()
  login: string;

  @IsEnum(Roles)
  role: Roles;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  confirmationStatus: boolean;

  @IsOptional()
  confirmationNumber: number;

  // @IsOptional()
  // @IsArray()
  // @IsObject({ each: true })
  // profile?: object[];
  //
  // @IsOptional()
  // @IsArray()
  // orders?: string[];
}
