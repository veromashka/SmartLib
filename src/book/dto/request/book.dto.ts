import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsArray,
  ArrayMinSize,
  IsObject,
} from 'class-validator';
import { Categories } from 'src/common/enums';

export class BookRequestDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsInt()
  releaseYear: number;

  //
  @IsEnum(Categories)
  category: Categories;

  @IsArray()
  // "each" tells class-validator to run the validation on each item of the array
  @IsString({ each: true })
  @ArrayMinSize(1)
  genres: string[];
}
