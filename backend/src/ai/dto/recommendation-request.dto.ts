import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RecommendationRequestDto {
  @ApiProperty({ example: 'fantasy', description: 'Primary genre to recommend from' })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  genre: string;

  @ApiPropertyOptional({
    example: ['Brandon Sanderson'],
    description: 'Authors the user already enjoys (used as soft preference)',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoriteAuthors?: string[];

  @ApiPropertyOptional({ default: 5, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  limit?: number = 5;
}
