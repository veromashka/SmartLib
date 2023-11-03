import { IsNotEmpty, IsOptional, MaxDate, MinDate } from 'class-validator';
import { BookRequestDto } from './book.dto';
import constants from '../../../shared/util/constants';
import { Type } from 'class-transformer';

export class CreateBookRequestDto extends BookRequestDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  @Type(() => Date)
  @MaxDate(new Date(constants.avaliableDate))
  @MinDate(new Date('1800-01-01'))
  releaseDate: Date;

  @IsOptional()
  genres: string[];
}
