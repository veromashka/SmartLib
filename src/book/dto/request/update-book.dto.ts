import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxDate,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Categories, Currencies } from 'src/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import constants from '../../../shared/util/constants';

export class UpdateBookRequestDto {
  @ApiProperty({ description: 'Title', example: 'Harry Poter' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  title: string;

  @ApiProperty({ description: 'Author', example: 'Joan Rouling' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  author: string;

  @ApiProperty({ description: 'Release Year', example: '2003-10-02' })
  @IsOptional()
  @IsDate()
  @MaxDate(new Date(constants.avaliableDate))
  releaseDate: Date;

  @ApiProperty({ description: 'Price', example: 200 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(99999)
  price: number;

  @ApiProperty({
    enum: Currencies,
    example: ['USD', 'UAH', 'EUR'],
  })
  @IsOptional()
  @IsEnum(Currencies)
  currency: Currencies;

  @ApiProperty({
    enum: Categories,
    example: ['FOR_CHILDREN', 'FOR_TEENS', 'FOR_ADULTS'],
  })
  @IsOptional()
  @IsEnum(Categories)
  category: Categories;

  @ApiProperty({
    description: 'Genres',
    example: '["24f766e1-5d92-4756-a099-c247961c2863"]',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  genres: string[];
}
