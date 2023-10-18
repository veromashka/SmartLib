import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBookResponseDto {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsInt()
  releaseYear: number;
}
