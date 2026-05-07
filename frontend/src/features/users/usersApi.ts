import { baseApi } from '@/shared/api/baseApi';
import type { PaginatedResponse, User } from '@/shared/types/user';
import type { Role } from '@/shared/types/role';

interface ListUsersArgs {
  page?: number;
  limit?: number;
  role?: Role;
  includeDeleted?: boolean;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listUsers: build.query<PaginatedResponse<User>, ListUsersArgs | void>({
      query: (args) => ({
        url: '/users',
        params: args ?? {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    deleteUser: build.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
  }),
});

export const { useListUsersQuery, useDeleteUserMutation } = usersApi;
