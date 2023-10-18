import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsObject,
  IsBoolean,
} from 'class-validator';

export class UserDto {
  @IsString()
  login: string;

  //TODO: remove
  // @IsEnum(Roles)
  // role: Roles;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsBoolean()
  confirmationStatus: boolean;

  @IsOptional()
  confirmationNumber: number;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  profile?: object[];

  @IsOptional()
  @IsArray()
  orders?: string[];
}
