import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRequestDto {
  @ApiProperty({ description: 'Email', example: 'test@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: 'Password1*' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
