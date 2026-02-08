import { SelectUser, InsertUser } from "@/db/schema";

// Base User Types
export type User = SelectUser;
export type UserInsert = InsertUser;

// DTO Types
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  avatar_url?: string;
}

export interface UpdateUserDTO {
  name?: string;
  avatar_url?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

// Response Types
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListResponse {
  users: UserResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface AuthResponse {
  user: UserResponse;
  token?: string;
}

// Query/Filter Types
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface UserFilterOptions {
  name?: string;
  email?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

// Utility Types
export type UserPublicProfile = Omit<UserResponse, 'email'>;
export type UserWithoutPassword = Omit<User, 'password'>;
export type UserUpdateFields = Partial<UpdateUserDTO>;
