import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { GoogleBooksProvider } from './providers/google-books.provider';
import { OpenLibraryProvider } from './providers/open-library.provider';
import { SearchBooksDto, SearchSource } from './dto/search-books.dto';
import { PaginatedBooks } from './interfaces/normalized-book.interface';

type SearchKind = 'title' | 'author';

@Injectable()
export class BooksParserService {
  private readonly logger = new Logger(BooksParserService.name);
  private readonly cacheTtlMs = 60 * 60 * 1000; // 1h

  constructor(
    private readonly google: GoogleBooksProvider,
    private readonly openLib: OpenLibraryProvider,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  searchByTitle(dto: SearchBooksDto): Promise<PaginatedBooks> {
    return this.search('title', dto);
  }

  searchByAuthor(dto: SearchBooksDto): Promise<PaginatedBooks> {
    return this.search('author', dto);
  }

  private async search(
    kind: SearchKind,
    dto: SearchBooksDto,
  ): Promise<PaginatedBooks> {
    if (!dto.q?.trim()) {
      throw new BadRequestException('Query string `q` is required');
    }

    const cacheKey = `books:${kind}:${dto.source}:${dto.page}:${dto.pageSize}:${dto.q.toLowerCase()}`;
    const cached = await this.cache.get<PaginatedBooks>(cacheKey);
    if (cached) {
      this.logger.debug(`cache HIT ${cacheKey}`);
      return cached;
    }

    const opts = { page: dto.page, pageSize: dto.pageSize };
    const callProvider = (p: GoogleBooksProvider | OpenLibraryProvider) =>
      kind === 'title'
        ? p.searchByTitle(dto.q, opts)
        : p.searchByAuthor(dto.q, opts);

    let result: PaginatedBooks;

    if (dto.source === SearchSource.GOOGLE) {
      result = await callProvider(this.google);
    } else if (dto.source === SearchSource.OPEN_LIBRARY) {
      result = await callProvider(this.openLib);
    } else {
      // SearchSource.ALL — query both in parallel; tolerate one provider failing.
      const [g, o] = await Promise.allSettled([
        callProvider(this.google),
        callProvider(this.openLib),
      ]);

      const items = [
        ...(g.status === 'fulfilled' ? g.value.items : []),
        ...(o.status === 'fulfilled' ? o.value.items : []),
      ];
      const total =
        (g.status === 'fulfilled' ? g.value.total : 0) +
        (o.status === 'fulfilled' ? o.value.total : 0);

      if (g.status === 'rejected') this.logger.warn(`google failed: ${g.reason}`);
      if (o.status === 'rejected') this.logger.warn(`openlib failed: ${o.reason}`);

      result = {
        source: 'aggregated',
        page: dto.page,
        pageSize: dto.pageSize,
        total,
        items,
      };
    }

    await this.cache.set(cacheKey, result, this.cacheTtlMs);
    return result;
  }
}
