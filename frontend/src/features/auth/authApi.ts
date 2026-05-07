import { baseApi } from '@/shared/api/baseApi';
import type { User } from '@/shared/types/user';
import { setCredentials, setUser } from './authSlice';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

/**
 * Auth endpoints injected into the central baseApi.
 * Pattern: every feature ships its own slice file like this — keeps `baseApi`
 * agnostic and code-split-friendly.
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      // On success → push token+user into Redux so RTK Query can authorize next calls.
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          /* error already surfaced by the mutation hook */
        }
      },
    }),

    me: build.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          /* noop */
        }
      },
    }),
  }),
});

export const { useLoginMutation, useMeQuery, useLazyMeQuery } = authApi;
