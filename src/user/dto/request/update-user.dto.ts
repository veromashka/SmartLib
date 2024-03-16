import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Login', example: 'veromashka' })
  @IsOptional()
  login: string;

  @IsOptional()
  @IsBoolean()
  confirmationStatus: boolean;

  @IsOptional()
  confirmationNumber: number;
}
