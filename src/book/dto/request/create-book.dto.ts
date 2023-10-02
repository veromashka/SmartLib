import {  ArrayMinSize, IsArray, IsInt, IsNotEmpty,  IsOptional,  IsString} from 'class-validator';
import { BookRequestDto } from './book.dto';
import { Categories } from 'src/common/enums';

export class CreateBookRequestDto extends BookRequestDto {
  @IsNotEmpty()
  title: string

  // @IsNotEmpty()
  // author: string

  // @IsNotEmpty()
  // releaseYear: number

  // @IsNotEmpty()
  // category: Categories

  // @IsOptional()
  // // "each" tells class-validator to run the validation on each item of the array
  // genre: string[]

}

