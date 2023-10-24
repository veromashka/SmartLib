import { Controller, Post, Body, UseFilters, UseGuards } from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/request/create-order';
import { Orders } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('order')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@UseFilters(new HttpExceptionFilter())
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('new')
  async createOrder(@Body() data: CreateOrderDto): Promise<Orders> {
    return this.orderService.createNew(data);
  }
}
