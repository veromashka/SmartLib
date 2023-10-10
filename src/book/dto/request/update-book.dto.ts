import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Categories } from 'src/common/enums';

export class UpdateBookRequestDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  author: string;

  @IsOptional()
  releaseYear: number;

  @IsOptional()
  genre: string[];

  @IsOptional()
  category: Categories;
}
