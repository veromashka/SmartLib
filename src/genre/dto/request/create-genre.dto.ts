import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGenreRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
