import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseGuards,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/request/create-order';
import { Orders } from '@prisma/client';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('order')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@UseFilters(new HttpExceptionFilter())
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @ApiResponse({ status: 201, description: 'Created.' })
  @ApiResponse({ status: 401, description: 'Unatorized.' })
  @ApiResponse({ status: 500, description: 'Orders limit reached.' })
  @Post('/:id')
  async createOrder(
    @Param('id') id: string,
    @Body() data: CreateOrderDto
  ): Promise<Orders> {
    return this.orderService.createNew(id, data);
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM)
  @Get('/all')
  async getOrders(): Promise<Orders[]> {
    return this.orderService.getAll();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM)
  @Delete('/expired')
  async deleteExpiredOrders(): Promise<any> {
    return this.orderService.deleteOrders();
  }
}
