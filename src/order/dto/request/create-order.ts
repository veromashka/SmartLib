import { OrderDto } from './order.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto extends OrderDto {
  @IsNotEmpty()
  paid: boolean;

  @IsNotEmpty()
  term: number;

  @IsNotEmpty()
  bookId: string;

  @IsOptional()
  createdAt: Date;
}
