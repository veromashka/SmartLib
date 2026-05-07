import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';
import { logout } from '@/features/auth/authSlice';

/**
 * Base query attaches the JWT from Redux state as a Bearer header.
 * `prepareHeaders` runs on every request → token rotation just works.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

/**
 * `baseQueryWithReauth` — central place for cross-cutting auth behavior.
 *
 * Today: on 401 we drop the session and let routing redirect to /login.
 *
 * If/when the backend adds a refresh-token endpoint, the only place to
 * implement the refresh-then-retry dance is right here:
 *   1. catch 401
 *   2. call /auth/refresh
 *   3. on success → store new token, retry original args
 *   4. on failure → dispatch logout()
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

/**
 * Single API slice — feature endpoints inject themselves with `injectEndpoints`.
 * This keeps bundle size lean and avoids one mega-file.
 *
 * Tag types listed centrally so any feature can invalidate cross-feature data.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Books', 'Users', 'Notes', 'BookSearch'],
  endpoints: () => ({}),
});
