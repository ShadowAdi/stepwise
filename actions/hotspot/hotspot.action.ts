'use server'

import { getUserIdFromToken } from "@/helper/get-user-from-id";
import { ActionResponse, CreateHotspotDTO, HotspotResponse, UpdateHotspotDTO } from "@/types";
import { db } from "@/db";
import { hotspots, steps } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getStep } from "../steps/steps.action";

export const createHotspot = async (
    payload: CreateHotspotDTO,
    token: string
): Promise<ActionResponse<HotspotResponse>> => {
    try {
        if (!token) {
            return {
                success: false,
                error: "Authentication required"
            };
        }

        const authResult = await getUserIdFromToken(token);
        if (!authResult.success) {
            return {
                success: false,
                error: authResult.error
            };
        }

        if (!payload.stepId) {
            return {
                success: false,
                error: "Step ID is required"
            };
        }

        // Verify step exists
        const stepResponse = await getStep(payload.stepId);
        if (!stepResponse.success) {
            return {
                success: false,
                error: "Step not found"
            };
        }

        // Validate required fields
        if (!payload.x || !payload.y || !payload.width || !payload.height || !payload.color) {
            return {
                success: false,
                error: "Position (x, y, width, height) and color are required"
            };
        }

        // If targetStepId is provided, verify it exists
        if (payload.targetStepId) {
            const targetStepResponse = await getStep(payload.targetStepId);
            if (!targetStepResponse.success) {
                return {
                    success: false,
                    error: "Target step not found"
                };
            }
        }

        const [hotspot] = await db.insert(hotspots).values({
            stepId: payload.stepId,
            x: payload.x,
            y: payload.y,
            width: payload.width,
            height: payload.height,
            color: payload.color,
            borderRadius: payload.borderRadius || "0",
            tooltipText: payload.tooltipText || null,
            tooltipPlacement: payload.tooltipPlacement || null,
            targetStepId: payload.targetStepId || null,
        }).returning();

        return {
            success: true,
            data: hotspot
        };
    } catch (error) {
        console.error("Failed to create hotspot:", error);

        if (error instanceof Error) {
            if (error.message.includes("connection")) {
                return {
                    success: false,
                    error: "Database connection failed. Please try again later"
                };
            }
        }

        return {
            success: false,
            error: "Failed to create hotspot. Please try again"
        };
    }
};

export const getHotspotsByStepId = async (
    stepId: string,
    token?: string
): Promise<ActionResponse<HotspotResponse[]>> => {
    try {
        if (!stepId) {
            return {
                success: false,
                error: "Step ID is required"
            };
        }

        // Verify step exists
        const stepResponse = await getStep(stepId);
        if (!stepResponse.success) {
            return {
                success: false,
                error: "Step not found"
            };
        }

        const allHotspots = await db
            .select()
            .from(hotspots)
            .where(eq(hotspots.stepId, stepId));

        return {
            success: true,
            data: allHotspots
        };
    } catch (error) {
        console.error("Failed to get hotspots:", error);

        if (error instanceof Error) {
            if (error.message.includes("connection")) {
                return {
                    success: false,
                    error: "Database connection failed. Please try again later"
                };
            }
        }

        return {
            success: false,
            error: "Failed to get hotspots. Please try again"
        };
    }
};

export const getHotspot = async (
    hotspotId: string
): Promise<ActionResponse<HotspotResponse>> => {
    try {
        if (!hotspotId) {
            return {
                success: false,
                error: "Hotspot ID is required"
            };
        }

        const [hotspot] = await db
            .select()
            .from(hotspots)
            .where(eq(hotspots.id, hotspotId))
            .limit(1);

        if (!hotspot) {
            return {
                success: false,
                error: "Hotspot not found"
            };
        }

        return {
            success: true,
            data: hotspot
        };
    } catch (error) {
        console.error("Failed to get hotspot:", error);

        if (error instanceof Error) {
            if (error.message.includes("connection")) {
                return {
                    success: false,
                    error: "Database connection failed. Please try again later"
                };
            }
        }

        return {
            success: false,
            error: "Failed to get hotspot. Please try again"
        };
    }
};

export const updateHotspot = async (
    hotspotId: string,
    payload: UpdateHotspotDTO,
    token: string
): Promise<ActionResponse<HotspotResponse>> => {
    try {
        if (!token) {
            return {
                success: false,
                error: "Authentication required"
            };
        }

        const authResult = await getUserIdFromToken(token);
        if (!authResult.success) {
            return {
                success: false,
                error: authResult.error
            };
        }

        if (!hotspotId) {
            return {
                success: false,
                error: "Hotspot ID is required"
            };
        }

        // Verify hotspot exists
        const hotspotResponse = await getHotspot(hotspotId);
        if (!hotspotResponse.success) {
            return {
                success: false,
                error: "Hotspot not found"
            };
        }

        // If targetStepId is being updated, verify it exists
        if (payload.targetStepId) {
            const targetStepResponse = await getStep(payload.targetStepId);
            if (!targetStepResponse.success) {
                return {
                    success: false,
                    error: "Target step not found"
                };
            }
        }

        const updateData: Partial<UpdateHotspotDTO> = {};
        if (payload.x !== undefined) updateData.x = payload.x;
        if (payload.y !== undefined) updateData.y = payload.y;
        if (payload.width !== undefined) updateData.width = payload.width;
        if (payload.height !== undefined) updateData.height = payload.height;
        if (payload.color !== undefined) updateData.color = payload.color;
        if (payload.borderRadius !== undefined) updateData.borderRadius = payload.borderRadius;
        if (payload.tooltipText !== undefined) updateData.tooltipText = payload.tooltipText;
        if (payload.tooltipPlacement !== undefined) updateData.tooltipPlacement = payload.tooltipPlacement;
        if (payload.targetStepId !== undefined) updateData.targetStepId = payload.targetStepId;

        if (Object.keys(updateData).length === 0) {
            return {
                success: false,
                error: "No fields to update"
            };
        }

        const [updatedHotspot] = await db
            .update(hotspots)
            .set(updateData)
            .where(eq(hotspots.id, hotspotId))
            .returning();

        return {
            success: true,
            data: updatedHotspot
        };
    } catch (error) {
        console.error("Failed to update hotspot:", error);

        if (error instanceof Error) {
            if (error.message.includes("connection")) {
                return {
                    success: false,
                    error: "Database connection failed. Please try again later"
                };
            }
        }

        return {
            success: false,
            error: "Failed to update hotspot. Please try again"
        };
    }
};

export const deleteHotspot = async (
    hotspotId: string,
    token: string
): Promise<ActionResponse<{ message: string }>> => {
    try {
        if (!token) {
            return {
                success: false,
                error: "Authentication required"
            };
        }

        const authResult = await getUserIdFromToken(token);
        if (!authResult.success) {
            return {
                success: false,
                error: authResult.error
            };
        }

        if (!hotspotId) {
            return {
                success: false,
                error: "Hotspot ID is required"
            };
        }

        // Verify hotspot exists
        const hotspotResponse = await getHotspot(hotspotId);
        if (!hotspotResponse.success) {
            return {
                success: false,
                error: "Hotspot not found"
            };
        }

        await db.delete(hotspots).where(eq(hotspots.id, hotspotId));

        return {
            success: true,
            data: { message: "Hotspot deleted successfully" }
        };
    } catch (error) {
        console.error("Failed to delete hotspot:", error);

        if (error instanceof Error) {
            if (error.message.includes("connection")) {
                return {
                    success: false,
                    error: "Database connection failed. Please try again later"
                };
            }
        }

        return {
            success: false,
            error: "Failed to delete hotspot. Please try again"
        };
    }
};

export const deleteHotspotsByStepId = async (
    stepId: string,
    token: string
): Promise<ActionResponse<{ message: string; deletedCount: number }>> => {
    try {
        if (!token) {
            return {
                success: false,
                error: "Authentication required"
            };
        }

        const authResult = await getUserIdFromToken(token);
        if (!authResult.success) {
            return {
                success: false,
                error: authResult.error
            };
        }

        if (!stepId) {
            return {
                success: false,
                error: "Step ID is required"
            };
        }

        // Get count before deletion
        const existingHotspots = await db
            .select()
            .from(hotspots)
            .where(eq(hotspots.stepId, stepId));

        const deletedCount = existingHotspots.length;

        await db.delete(hotspots).where(eq(hotspots.stepId, stepId));

        return {
            success: true,
            data: {
                message: `${deletedCount} hotspot(s) deleted successfully`,
                deletedCount
            }
        };
    } catch (error) {
        console.error("Failed to delete hotspots:", error);

        if (error instanceof Error) {
            if (error.message.includes("connection")) {
                return {
                    success: false,
                    error: "Database connection failed. Please try again later"
                };
            }
        }

        return {
            success: false,
            error: "Failed to delete hotspots. Please try again"
        };
    }
};
