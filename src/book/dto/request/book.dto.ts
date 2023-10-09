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
  @IsObject({ each: true })
  orders: object[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  genres: string[];
}
