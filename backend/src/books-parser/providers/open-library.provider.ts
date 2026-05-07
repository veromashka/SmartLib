import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import {
  BookProvider,
  SearchOptions,
} from '../interfaces/book-provider.interface';
import {
  NormalizedBook,
  PaginatedBooks,
} from '../interfaces/normalized-book.interface';

interface OpenLibraryDoc {
  key: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  publisher?: string[];
  isbn?: string[];
  number_of_pages_median?: number;
  language?: string[];
  subject?: string[];
  cover_i?: number;
}

interface OpenLibraryResponse {
  numFound: number;
  docs: OpenLibraryDoc[];
}

@Injectable()
export class OpenLibraryProvider implements BookProvider {
  readonly name = 'open_library' as const;
  private readonly logger = new Logger(OpenLibraryProvider.name);
  private readonly baseUrl = 'https://openlibrary.org/search.json';

  constructor(private readonly http: HttpService) {}

  searchByTitle(q: string, opts: SearchOptions) {
    return this.search({ title: q }, opts);
  }

  searchByAuthor(q: string, opts: SearchOptions) {
    return this.search({ author: q }, opts);
  }

  private async search(
    queryParams: Record<string, string>,
    { page, pageSize }: SearchOptions,
  ): Promise<PaginatedBooks> {
    const params = { ...queryParams, page, limit: pageSize };

    const response = await firstValueFrom<AxiosResponse<OpenLibraryResponse>>(
      this.http
        .get<OpenLibraryResponse>(this.baseUrl, { params, timeout: 8000 })
        .pipe(
          catchError((err: AxiosError) => {
            this.logger.error(
              `Open Library request failed: ${err.message}`,
              err.stack,
            );
            throw new ServiceUnavailableException(
              'Open Library API is unavailable',
            );
          }),
        ),
    );
    const { data } = response;

    return {
      source: this.name,
      page,
      pageSize,
      total: data.numFound ?? 0,
      items: (data.docs ?? []).map((d) => this.normalize(d)),
    };
  }

  private normalize(d: OpenLibraryDoc): NormalizedBook {
    const isbn10 = d.isbn?.find((x) => x.length === 10);
    const isbn13 = d.isbn?.find((x) => x.length === 13);
    const cover = d.cover_i
      ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
      : undefined;

    return {
      source: this.name,
      externalId: d.key,
      title: d.title ?? 'Untitled',
      authors: d.author_name ?? [],
      publishedYear: d.first_publish_year,
      publisher: d.publisher?.[0],
      isbn10,
      isbn13,
      pageCount: d.number_of_pages_median,
      language: d.language?.[0],
      categories: d.subject?.slice(0, 5),
      thumbnailUrl: cover,
      infoUrl: `https://openlibrary.org${d.key}`,
    };
  }
}
