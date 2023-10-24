import { IsOptional, IsString } from 'class-validator';
import { Users } from '@prisma/client';

export class SignupResponseDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  createdUser?: Users;
}
