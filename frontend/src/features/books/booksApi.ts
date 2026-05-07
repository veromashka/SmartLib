import { baseApi } from '@/shared/api/baseApi';
import type { Book, PaginatedBooks } from './types';

interface SearchParams {
  q: string;
  page?: number;
  pageSize?: number;
  source?: 'google' | 'openlibrary' | 'all';
}

export const booksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listBooks: build.query<Book[], void>({
      query: () => '/book/all',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Books' as const, id })),
              { type: 'Books', id: 'LIST' },
            ]
          : [{ type: 'Books', id: 'LIST' }],
    }),

    /**
     * External search — debouncing happens at the component layer
     * (via `useDebouncedValue`). RTK Query then de-dupes identical
     * requests, so typing fast won't flood the backend.
     */
    searchByTitle: build.query<PaginatedBooks, SearchParams>({
      query: ({ q, page = 1, pageSize = 8, source = 'all' }) => ({
        url: '/books-parser/search/title',
        params: { q, page, pageSize, source },
      }),
      providesTags: ['BookSearch'],
    }),

    searchByAuthor: build.query<PaginatedBooks, SearchParams>({
      query: ({ q, page = 1, pageSize = 8, source = 'all' }) => ({
        url: '/books-parser/search/author',
        params: { q, page, pageSize, source },
      }),
      providesTags: ['BookSearch'],
    }),
  }),
});

export const {
  useListBooksQuery,
  useSearchByTitleQuery,
  useSearchByAuthorQuery,
  useLazySearchByTitleQuery,
  useLazySearchByAuthorQuery,
} = booksApi;
