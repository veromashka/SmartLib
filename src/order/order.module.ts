import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  providers: [PrismaService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
