import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Books as BookModel } from '@prisma/client';
import { CreateBookRequestDto } from './dto/request/create-book.dto';
import { UpdateBookRequestDto } from './dto/request/update-book.dto';
import { BookService } from './book.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Role } from '../common/enums/role.enum';

/**
 * Authorization matrix for the book catalog:
 *   - READER  → read endpoints (GET)
 *   - MANAGER → read + create + update
 *   - ADMIN   → everything (incl. delete)
 *
 * Public catalog browsing (GET /book/all) intentionally stays open so the
 * landing page works without a token.
 */
@ApiTags('books')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Public()
  @Get('all')
  @ApiOperation({ summary: 'Public list of books' })
  findAll(): Promise<BookModel[]> {
    return this.bookService.getAll();
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post('new')
  @ApiOperation({ summary: 'Create a book (ADMIN, MANAGER)' })
  createBook(@Body() data: CreateBookRequestDto): Promise<BookModel> {
    return this.bookService.create(data);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Put(':id')
  @ApiOperation({ summary: 'Update a book (ADMIN, MANAGER)' })
  update(
    @Param('id') id: string,
    @Body() data: UpdateBookRequestDto,
  ): Promise<BookModel> {
    return this.bookService.update(id, data);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book (ADMIN only)' })
  remove(@Param('id') id: string): Promise<BookModel> {
    return this.bookService.remove(id);
  }
}
