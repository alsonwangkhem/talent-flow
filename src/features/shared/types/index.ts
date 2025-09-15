// common structure for db entities
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// common structure for paginated responses
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// standard error response
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}
