import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

interface GoogleBookVolume {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
    language?: string;
    categories?: string[];
    imageLinks?: { thumbnail?: string };
    infoLink?: string;
    industryIdentifiers?: { type: string; identifier: string }[];
  };
}

interface GoogleBooksResponse {
  totalItems: number;
  items?: GoogleBookVolume[];
}

@Injectable()
export class GoogleBooksProvider implements BookProvider {
  readonly name = 'google_books' as const;
  private readonly logger = new Logger(GoogleBooksProvider.name);
  private readonly baseUrl = 'https://www.googleapis.com/books/v1/volumes';

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  searchByTitle(q: string, opts: SearchOptions) {
    return this.search(`intitle:${q}`, opts);
  }

  searchByAuthor(q: string, opts: SearchOptions) {
    return this.search(`inauthor:${q}`, opts);
  }

  private async search(
    q: string,
    { page, pageSize }: SearchOptions,
  ): Promise<PaginatedBooks> {
    const apiKey = this.config.get<string>('GOOGLE_BOOKS_API_KEY');
    const startIndex = (page - 1) * pageSize;

    const params: Record<string, string | number> = {
      q,
      startIndex,
      maxResults: pageSize,
    };
    if (apiKey) params.key = apiKey;

    const response = await firstValueFrom<AxiosResponse<GoogleBooksResponse>>(
      this.http
        .get<GoogleBooksResponse>(this.baseUrl, { params, timeout: 8000 })
        .pipe(
          catchError((err: AxiosError) => {
            this.logger.error(
              `Google Books request failed: ${err.message}`,
              err.stack,
            );
            throw new ServiceUnavailableException(
              'Google Books API is unavailable',
            );
          }),
        ),
    );
    const { data } = response;

    return {
      source: this.name,
      page,
      pageSize,
      total: data.totalItems ?? 0,
      items: (data.items ?? []).map((v) => this.normalize(v)),
    };
  }

  private normalize(v: GoogleBookVolume): NormalizedBook {
    const info = v.volumeInfo ?? {};
    const isbn10 = info.industryIdentifiers?.find((i) => i.type === 'ISBN_10')
      ?.identifier;
    const isbn13 = info.industryIdentifiers?.find((i) => i.type === 'ISBN_13')
      ?.identifier;
    const year = info.publishedDate
      ? Number(info.publishedDate.slice(0, 4)) || undefined
      : undefined;

    return {
      source: this.name,
      externalId: v.id,
      title: info.title ?? 'Untitled',
      authors: info.authors ?? [],
      description: info.description,
      publishedYear: year,
      publisher: info.publisher,
      isbn10,
      isbn13,
      pageCount: info.pageCount,
      language: info.language,
      categories: info.categories,
      thumbnailUrl: info.imageLinks?.thumbnail,
      infoUrl: info.infoLink,
    };
  }
}
