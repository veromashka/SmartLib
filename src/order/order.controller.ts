import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseGuards,
  Param,
  Get,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/request/create-order';
import { Orders } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Cron } from '@nestjs/schedule';

@Controller('order')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@UseFilters(new HttpExceptionFilter())
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/:id')
  async createOrder(
    @Param('id') id: string,
    @Body() data: CreateOrderDto
  ): Promise<Orders> {
    return this.orderService.createNew(id, data);
  }

  //TODO
  // @Cron('45 * * * * *')
  @Get('/all')
  async getOrders(): Promise<Orders[]> {
    return this.orderService.getAll();
  }
}
