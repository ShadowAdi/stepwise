// Export all types from subdirectories
export * from './action-response';
export * from './user';
export * from './demo';
export * from './step';
export * from './hotspot';

// Common API Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  search?: string;
}

// Common Query Types
export type QueryParams = PaginationParams & SortParams & SearchParams;

// API Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrors {
  errors: ValidationError[];
}

// Common Utility Types
export type ID = string;
export type Timestamp = Date;
export type Optional<T> = T | null | undefined;
