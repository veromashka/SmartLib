import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SecretNumberDto {
  @ApiProperty({ description: 'Secret number', example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  secretNumber: number;
}
