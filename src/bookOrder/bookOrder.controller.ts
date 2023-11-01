import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BooksOrder, Genres as GenresModel } from '@prisma/client';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookOrderService } from './bookOrder.service';

@Controller('booksOrder')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('booksOrder')
export class BookOrderController {
  constructor(private readonly bookOrderService: BookOrderService) {}
  @Get('all')
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 500, description: 'Serveral error.' })
  async getAllGenres(): Promise<BooksOrder[]> {
    return await this.bookOrderService.getAll();
  }
  @Get(':orderId')
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async findById(
    @Param('orderId') orderId: string
  ): Promise<BooksOrder[] | any> {
    return this.bookOrderService.getById(orderId);
  }
}
