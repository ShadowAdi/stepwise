import { SelectHotspots, InsertHotspots } from "@/db/schema";

// Base Hotspot Types
export type Hotspot = SelectHotspots;
export type HotspotInsert = InsertHotspots;

// DTO Types
export interface CreateHotspotDTO {
  stepId: string;
  x: string;
  y: string;
  width: string;
  height: string;
  color: string;
  borderRadius?: string;
  tooltipText?: string;
  tooltipPlacement?: string;
  targetStepId?: string;
}

export interface UpdateHotspotDTO {
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  color?: string;
  borderRadius?: string;
  tooltipText?: string;
  tooltipPlacement?: string;
  targetStepId?: string;
}

// Response Types
export interface HotspotResponse {
  id: string;
  stepId: string;
  x: string;
  y: string;
  width: string;
  height: string;
  color: string;
  borderRadius: string | null;
  tooltipText: string | null;
  tooltipPlacement: string | null;
  targetStepId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface HotspotWithTargetStepResponse extends HotspotResponse {
  targetStep?: {
    id: string;
    title: string | null;
    imageUrl: string;
  };
}

export interface HotspotListResponse {
  hotspots: HotspotResponse[];
  total: number;
}

// Query/Filter Types
export interface HotspotQueryParams {
  stepId?: string;
  page?: number;
  limit?: number;
  hasTooltip?: boolean;
  hasTargetStep?: boolean;
}

export interface HotspotFilterOptions {
  stepId?: string;
  color?: string;
  hasTooltip?: boolean;
  hasTargetStep?: boolean;
}

// Utility Types
export type HotspotUpdateFields = Partial<UpdateHotspotDTO>;
export type HotspotPosition = {
  x: string;
  y: string;
  width: string;
  height: string;
};

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface HotspotCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}
