import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

/**
 * Hard cap for highlighted text. 4000 chars is generous for any reasonable
 * highlight; protects DB / payload size from abuse.
 */
export const SELECTED_TEXT_MAX_LENGTH = 4000;
export const COMMENT_MAX_LENGTH = 2000;

export class CreateNoteDto {
  @ApiProperty({
    description: 'Highlighted text fragment from the book',
    minLength: 1,
    maxLength: SELECTED_TEXT_MAX_LENGTH,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(SELECTED_TEXT_MAX_LENGTH)
  selectedText: string;

  @ApiPropertyOptional({
    description: 'User comment / annotation',
    maxLength: COMMENT_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(COMMENT_MAX_LENGTH)
  comment?: string;

  @ApiPropertyOptional({ description: 'Page number (1-based)', minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number;
}
