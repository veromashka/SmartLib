import { PaginatedBooks } from './normalized-book.interface';

export interface SearchOptions {
  page: number; // 1-based
  pageSize: number; // capped by service
}

/**
 * Common contract every external book provider implements.
 * Lets us add new sources (e.g. ISBNdb) without touching the controller.
 */
export interface BookProvider {
  readonly name: 'google_books' | 'open_library';

  searchByTitle(query: string, opts: SearchOptions): Promise<PaginatedBooks>;
  searchByAuthor(query: string, opts: SearchOptions): Promise<PaginatedBooks>;
}

export const BOOK_PROVIDERS = Symbol('BOOK_PROVIDERS');
