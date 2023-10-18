import {
  IsEnum,
  IsInt,
  IsString,
  IsArray,
  ArrayMinSize,
  IsNumber,
} from 'class-validator';
import { Categories } from 'src/common/enums';

export class BookRequestDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsInt()
  releaseYear: number;

  @IsNumber()
  price: number;

  @IsEnum(Categories)
  category: Categories;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  genres: string[];
}
