import type { Role } from './role';

export interface User {
  id: string;
  login: string;
  email: string;
  role: Role;
  createdAt?: string;
  deletedAt?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
