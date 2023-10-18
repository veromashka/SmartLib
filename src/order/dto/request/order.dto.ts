import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsString,
} from 'class-validator';

export class OrderDto {
  @IsBoolean()
  paid: boolean;

  @IsNumber()
  term: number;

  @IsInt()
  user: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  book: string[];
}
