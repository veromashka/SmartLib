import { baseApi } from '@/shared/api/baseApi';
import type { PaginatedResponse } from '@/shared/types/user';

export interface Note {
  id: string;
  userId: string;
  bookId: string;
  selectedText: string;
  comment: string | null;
  pageNumber: number | null;
  createdAt: string;
}

interface CreateNoteArgs {
  bookId: string;
  selectedText: string;
  comment?: string;
  pageNumber?: number;
}

export const notesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    myNotesForBook: build.query<
      PaginatedResponse<Note>,
      { bookId: string; page?: number; limit?: number }
    >({
      query: ({ bookId, page = 1, limit = 20 }) => ({
        url: `/books/${bookId}/notes/my`,
        params: { page, limit },
      }),
      providesTags: (_r, _e, { bookId }) => [{ type: 'Notes', id: bookId }],
    }),

    createNote: build.mutation<Note, CreateNoteArgs>({
      query: ({ bookId, ...body }) => ({
        url: `/books/${bookId}/notes`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { bookId }) => [{ type: 'Notes', id: bookId }],
    }),

    deleteNote: build.mutation<void, { id: string; bookId?: string }>({
      query: ({ id }) => ({ url: `/notes/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, { bookId }) =>
        bookId ? [{ type: 'Notes', id: bookId }] : ['Notes'],
    }),
  }),
});

export const {
  useMyNotesForBookQuery,
  useCreateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
