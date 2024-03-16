import { UserDto } from './user.dto';
import { IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends UserDto {
  @ApiProperty({ description: 'Login', example: 'veromashka' })
  @IsNotEmpty()
  login: string;

  @ApiProperty({ description: 'Email', example: 'test@gmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password', example: 'Password1*' })
  @IsNotEmpty()
  @Matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
  password: string;
}
