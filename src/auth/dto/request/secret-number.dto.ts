import { IsNotEmpty, IsNumber } from 'class-validator';

export class SecretNumberDto {
  @IsNotEmpty()
  @IsNumber()
  secretNumber: number;
}
