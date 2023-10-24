import { OrderDto } from './order.dto';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto extends OrderDto {
  @IsNotEmpty()
  term: number;

  @IsNotEmpty()
  books: string[];
}
