import { ArrayMinSize, IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BookRequestDto } from './book.dto';
import { Categories } from 'src/common/enums';

export class CreateBookRequestDto extends BookRequestDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  author: string

  @IsNotEmpty()
  releaseYear: number
}

