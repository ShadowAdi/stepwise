import { SelectDemo, InsertDemo } from "@/db/schema";
import { UserResponse } from "@/types/user";

// Base Demo Types
export type Demo = SelectDemo;
export type DemoInsert = InsertDemo;

// DTO Types
export interface CreateDemoDTO {
  title: string;
  slug: string;
  description?: string;
  userId: string;
  isPublic: boolean;
}

export interface UpdateDemoDTO {
  title?: string;
  slug?: string;
  description?: string;
  isPublic?: boolean;
}

// Response Types
export interface DemoResponse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  userId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DemoWithUserResponse extends DemoResponse {
  user: UserResponse;
}

export interface DemoWithStepsCountResponse extends DemoResponse {
  stepsCount: number;
}

export interface DemoDetailResponse extends DemoResponse {
  user: UserResponse;
  stepsCount: number;
}

export interface DemoListResponse {
  demos: DemoResponse[];
  total: number;
  page: number;
  limit: number;
}

// Query/Filter Types
export interface DemoQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  isPublic?: boolean;
  sortBy?: 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface DemoFilterOptions {
  title?: string;
  userId?: string;
  isPublic?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

// Utility Types
export type DemoUpdateFields = Partial<UpdateDemoDTO>;
export type DemoPublicInfo = Omit<DemoResponse, 'userId'>;
