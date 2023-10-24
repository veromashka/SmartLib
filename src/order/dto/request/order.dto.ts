import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty({ description: 'Termin', example: 22 })
  @IsNumber()
  term: number;

  @ApiProperty({ description: 'User', example: { id: ' user.id' } })
  @IsString()
  user: string;

  @ApiProperty({ description: 'Book', example: ['book.id'] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  book: string[];
}
