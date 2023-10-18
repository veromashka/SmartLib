import { IsNotEmpty, IsOptional } from 'class-validator';
import { BookRequestDto } from './book.dto';

export class CreateBookRequestDto extends BookRequestDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  releaseYear: number;

  @IsOptional()
  genres: string[];
}
