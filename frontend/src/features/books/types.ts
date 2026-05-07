export interface Book {
  id: string;
  title: string;
  author: string;
  releaseYear: number;
  category: 'FOR_CHILDREN' | 'FOR_TEENS' | 'FOR_ADULTS';
}

/** Result item from /books-parser/search/* — same shape as backend NormalizedBook. */
export interface ExternalBook {
  source: 'google_books' | 'open_library';
  externalId: string;
  title: string;
  authors: string[];
  description?: string;
  publishedYear?: number;
  thumbnailUrl?: string;
  infoUrl?: string;
}

export interface PaginatedBooks {
  source: string;
  page: number;
  pageSize: number;
  total: number;
  items: ExternalBook[];
}
