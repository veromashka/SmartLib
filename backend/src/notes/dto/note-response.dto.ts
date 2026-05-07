import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NoteResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty() bookId: string;
  @ApiProperty() selectedText: string;
  @ApiPropertyOptional({ nullable: true }) comment: string | null;
  @ApiPropertyOptional({ nullable: true }) pageNumber: number | null;
  @ApiProperty() createdAt: Date;
}
