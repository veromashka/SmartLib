import { IsDate, IsNotEmpty, IsOptional, MaxDate } from 'class-validator';
import { BookRequestDto } from './book.dto';

export class CreateBookRequestDto extends BookRequestDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  releaseDate: Date;

  @IsOptional()
  genres: string[];
}
