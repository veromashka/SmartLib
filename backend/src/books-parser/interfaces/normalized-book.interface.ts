/**
 * Provider-agnostic book shape returned by all external parsers.
 * Internal services and the API layer should ONLY consume this shape.
 */
export interface NormalizedBook {
  source: 'google_books' | 'open_library';
  externalId: string;
  title: string;
  authors: string[];
  description?: string;
  publishedYear?: number;
  publisher?: string;
  isbn10?: string;
  isbn13?: string;
  pageCount?: number;
  language?: string;
  categories?: string[];
  thumbnailUrl?: string;
  infoUrl?: string;
}

export interface PaginatedBooks {
  source: 'google_books' | 'open_library' | 'aggregated';
  page: number;
  pageSize: number;
  total: number;
  items: NormalizedBook[];
}
