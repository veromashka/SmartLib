import { OrderDto } from './order.dto';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto extends OrderDto {
  @IsNotEmpty()
  paid: boolean;

  @IsNotEmpty()
  term: number;

  @IsNotEmpty()
  books: string[];

  @IsNotEmpty()
  user: string;
}
