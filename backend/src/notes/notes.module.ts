import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { BookNotesController } from './book-notes.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [NotesController, BookNotesController],
  providers: [NotesService, PrismaService],
  exports: [NotesService],
})
export class NotesModule {}
