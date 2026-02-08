import { SelectStep, InsertStep } from "@/db/schema";
import { HotspotResponse } from "@/types/hotspot";

// Base Step Types
export type Step = SelectStep;
export type StepInsert = InsertStep;

// DTO Types
export interface CreateStepDTO {
  demoId: string;
  title?: string;
  description?: string;
  imageUrl: string;
  position: string;
}

export interface UpdateStepDTO {
  title?: string;
  description?: string;
  imageUrl?: string;
  position?: string;
}

export interface ReorderStepsDTO {
  stepId: string;
  position: string;
}

// Response Types
export interface StepResponse {
  id: string;
  demoId: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  position: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StepWithHotspotsResponse extends StepResponse {
  hotspots: HotspotResponse[];
}

export interface StepDetailResponse extends StepResponse {
  hotspots: HotspotResponse[];
  hotspotsCount: number;
}

export interface StepListResponse {
  steps: StepResponse[];
  total: number;
}

// Query/Filter Types
export interface StepQueryParams {
  demoId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'position' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface StepFilterOptions {
  demoId?: string;
  title?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

// Utility Types
export type StepUpdateFields = Partial<UpdateStepDTO>;
export type StepPosition = {
  id: string;
  position: string;
};
