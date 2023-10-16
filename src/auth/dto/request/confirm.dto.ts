import { IsEmail } from 'class-validator';

export class ConfirmDto {
  @IsEmail()
  email: string;
}
