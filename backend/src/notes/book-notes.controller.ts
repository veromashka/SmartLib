import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { ListNotesQueryDto } from './dto/list-notes.dto';
import { NoteResponseDto } from './dto/note-response.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';

/**
 * Book-scoped note endpoints. Authenticated users (READER, MANAGER, ADMIN)
 * can create and list their own notes.
 */
@ApiTags('notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER, Role.READER)
@Controller('books/:bookId/notes')
export class BookNotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Save a highlighted text fragment as a note' })
  @ApiCreatedResponse({ type: NoteResponseDto })
  create(
    @Param('bookId', new ParseUUIDPipe()) bookId: string,
    @Body() dto: CreateNoteDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<NoteResponseDto> {
    return this.notesService.create(user.sub, bookId, dto);
  }

  @Get('my')
  @ApiOperation({ summary: "Get current user's notes for the book" })
  @ApiOkResponse({ description: 'Paginated list of the caller’s notes' })
  findMy(
    @Param('bookId', new ParseUUIDPipe()) bookId: string,
    @Query() query: ListNotesQueryDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<PaginatedResponseDto<NoteResponseDto>> {
    return this.notesService.findMyNotesForBook(user.sub, bookId, query);
  }
}
