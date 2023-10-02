import {  IsInt, IsNotEmpty,  IsString, IsUUID} from 'class-validator';
import { isNullOrUndefined } from 'util';

export class CreateBookResponseDto {
  @IsUUID()
  id: string


  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  author: string

  @IsInt()
  releaseYear: number;

}