import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
} from 'class-validator';

export class OrderDto {
  @IsBoolean()
  paid: boolean;

  @IsNumber()
  term: number;

  @IsString()
  user: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  book: string[];
}
