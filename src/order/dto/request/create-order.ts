import { OrderDto } from './order.dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto extends OrderDto {
  @ApiProperty({ description: 'Termin', example: 22 })
  @IsNumber()
  @Min(1)
  @Max(90)
  term: number;

  @ApiProperty({ description: 'Book', example: ['book.id'] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  books: string[];
}
