import { ApiProperty } from '@nestjs/swagger';

export class RecommendedBookDto {
  @ApiProperty() title: string;
  @ApiProperty() author: string;
  @ApiProperty() reason: string;
}

export class RecommendationResponseDto {
  @ApiProperty({ example: 'fantasy' })
  genre: string;

  @ApiProperty({ type: [String], example: ['epic fantasy', 'sword and sorcery'] })
  similarGenres: string[];

  @ApiProperty({ type: [RecommendedBookDto] })
  books: RecommendedBookDto[];

  @ApiProperty({ description: 'Why these books were recommended' })
  explanation: string;
}
