import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { ListNotesQueryDto } from './dto/list-notes.dto';
import { NoteResponseDto } from './dto/note-response.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    bookId: string,
    dto: CreateNoteDto,
  ): Promise<NoteResponseDto> {
    // Confirm the book exists — otherwise FK error would surface as 500.
    const book = await this.prisma.books.findUnique({
      where: { id: bookId },
      select: { id: true },
    });
    if (!book) throw new NotFoundException(`Book ${bookId} not found`);

    return this.prisma.notes.create({
      data: {
        userId,
        bookId,
        selectedText: dto.selectedText,
        comment: dto.comment,
        pageNumber: dto.pageNumber,
      },
    });
  }

  async findMyNotesForBook(
    userId: string,
    bookId: string,
    query: ListNotesQueryDto,
  ): Promise<PaginatedResponseDto<NoteResponseDto>> {
    const { page, limit } = query;
    const where = { userId, bookId };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.notes.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notes.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  /**
   * Ownership-aware delete:
   *   - Note owner can delete their own note
   *   - ADMIN can delete any note
   *   - everyone else → 403
   */
  async remove(
    noteId: string,
    currentUserId: string,
    currentRole: Role,
  ): Promise<void> {
    const note = await this.prisma.notes.findUnique({
      where: { id: noteId },
      select: { id: true, userId: true },
    });
    if (!note) throw new NotFoundException(`Note ${noteId} not found`);

    const isOwner = note.userId === currentUserId;
    const isAdmin = currentRole === Role.ADMIN;
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only delete your own notes');
    }

    await this.prisma.notes.delete({ where: { id: noteId } });
  }
}
