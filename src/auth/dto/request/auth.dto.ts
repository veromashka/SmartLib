import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
