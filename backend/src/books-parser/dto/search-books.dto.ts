import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export enum SearchSource {
  GOOGLE = 'google',
  OPEN_LIBRARY = 'openlibrary',
  ALL = 'all',
}

export class SearchBooksDto {
  @ApiPropertyOptional({ description: 'Search query', example: 'dune' })
  @IsString()
  @MinLength(1)
  q: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 40 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(40)
  pageSize: number = 10;

  @ApiPropertyOptional({
    enum: SearchSource,
    default: SearchSource.ALL,
    description: 'Which provider to query',
  })
  @IsOptional()
  @IsEnum(SearchSource)
  source: SearchSource = SearchSource.ALL;
}
