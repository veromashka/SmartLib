import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreRequestDto {
  @ApiProperty({ description: 'Name', example: 'Comedy' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
