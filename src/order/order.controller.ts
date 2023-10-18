import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/request/create-order';
import { Users } from '@prisma/client';

@Controller('order')
@UseFilters(new HttpExceptionFilter())
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('new')
  async createOrder(@Body() data: CreateOrderDto, user: Users) {
    return this.orderService.createNew(data, user);
  }
}
