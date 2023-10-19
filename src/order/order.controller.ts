import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/request/create-order';
import { Orders } from '@prisma/client';

@Controller('order')
@UseFilters(new HttpExceptionFilter())
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('new')
  async createOrder(@Body() data: CreateOrderDto): Promise<Orders> {
    return this.orderService.createNew(data);
  }
}
