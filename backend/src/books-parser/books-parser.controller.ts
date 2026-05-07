import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BooksParserService } from './books-parser.service';
import { SearchBooksDto } from './dto/search-books.dto';
import { PaginatedBooks } from './interfaces/normalized-book.interface';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

/**
 * External catalog search. All authenticated users can search; only MANAGER /
 * ADMIN should be allowed to import results into the local DB (separate
 * endpoint, not in this MVP).
 */
@ApiTags('books-parser')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER, Role.READER)
@Controller('books-parser')
export class BooksParserController {
  constructor(private readonly parser: BooksParserService) {}

  @Get('search/title')
  @ApiOperation({ summary: 'Search external catalogs by title' })
  @ApiOkResponse({ description: 'Paginated normalized books' })
  searchByTitle(@Query() dto: SearchBooksDto): Promise<PaginatedBooks> {
    return this.parser.searchByTitle(dto);
  }

  @Get('search/author')
  @ApiOperation({ summary: 'Search external catalogs by author' })
  @ApiOkResponse({ description: 'Paginated normalized books' })
  searchByAuthor(@Query() dto: SearchBooksDto): Promise<PaginatedBooks> {
    return this.parser.searchByAuthor(dto);
  }
}
