'use server'

import { getUserIdFromToken } from "@/helper/get-user-from-id";
import { ActionResponse, CreateStepDTO, StepResponse, UpdateStepDTO } from "@/types";
import { getDemoById } from "../demos/demos.action";
import { db } from "@/db";
import { steps } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const createStep = async (
    payload: CreateStepDTO,
    token: string,
    demoId: string
): Promise<ActionResponse<StepResponse>> => {
    try {
        if (!token) {
            return {
                success: false,
                error: "Authentication required"
            };
        }

        if (!demoId) {
            return {
                success: false,
                error: "Demo Id is required"
            };
        }

        const authResult = await getUserIdFromToken(token);
        if (!authResult.success) {
            return {
                success: false,
                error: authResult.error
            };
        }

        const isDemoExist = await getDemoById(demoId, token)

        if (!isDemoExist) {
            return {
                success: false,
                error: `Demo not found for the given id`
            };
        }

        if (!payload.title) {
            return {
                success: false,
                error: "Title is required"
            };
        }


        const [step] = await db.insert(steps).values({
            title: payload.title,
            demoId: demoId,
            imageUrl: payload.imageUrl,
            position: payload.position,
            description: payload.description,
        }).returning();

        return {
            success: true,
            data: {
                ...step,
            }
        };
    } catch (error) {
        console.error("Failed to create step:", error);

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
            error: "Failed to create step. Please try again"
        };
    }
};

export const getAllSteps = async (
    demoId: string,
    token: string
): Promise<ActionResponse<StepResponse[]>> => {
    try {
        if (!demoId) {
            return {
                success: false,
                error: "Demo Id is required"
            };
        }

        const isDemoExist = await getDemoById(demoId, token)

        if (!isDemoExist) {
            return {
                success: false,
                error: `Demo not found for the given id`
            };
        }

        const allSteps = await db.select().from(steps).where(eq(steps.demoId, demoId))

        return {
            success: true,
            data: allSteps,
        };
    } catch (error) {
        console.error("Failed to get all steps:", error);

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
            error: "Failed to get all steps. Please try again"
        };
    }
};

export const getStep = async (
    stepId: string,
): Promise<ActionResponse<StepResponse>> => {
    try {
        if (!stepId) {
            return {
                success: false,
                error: "Demo Id is required"
            };
        }


        const [step] = await db.select().from(steps).where(eq(steps.id, stepId)).limit(1)

        if (!step) {
            return {
                success: false,
                error: "Step not found"
            };
        }

        return {
            success: true,
            data: step,
        };
    } catch (error) {
        console.error("Failed to get step:", error);

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
            error: "Failed to get step. Please try again"
        };
    }
};

export const deleteStep = async (
    stepId: string,
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

        if (!stepId) {
            return {
                success: false,
                error: "Step Id is required"
            };
        }

        const stepResponse = await getStep(stepId);

        if (!stepResponse.success) {
            return {
                success: false,
                error: `Failed to find step with given id`
            };
        }

        await db.delete(steps).where(eq(steps.id, stepId));

        return {
            success: true,
            data: { message: "Step deleted successfully" },
        };
    } catch (error) {
        console.error("Failed to delete step:", error);

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
            error: "Failed to delete step. Please try again"
        };
    }
};

export const updateStep = async (
    stepId: string,
    payload: UpdateStepDTO,
    token: string
): Promise<ActionResponse<StepResponse>> => {
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
                error: "Step Id is required"
            };
        }

        const stepResponse = await getStep(stepId);
        if (!stepResponse.success) {
            return {
                success: false,
                error: "Step not found"
            };
        }

        const updateData: Partial<UpdateStepDTO> = {};
        if (payload.title !== undefined) updateData.title = payload.title;
        if (payload.description !== undefined) updateData.description = payload.description;
        if (payload.imageUrl !== undefined) updateData.imageUrl = payload.imageUrl;
        if (payload.position !== undefined) updateData.position = payload.position;

        if (Object.keys(updateData).length === 0) {
            return {
                success: false,
                error: "No fields to update"
            };
        }

        const [updatedStep] = await db
            .update(steps)
            .set(updateData)
            .where(eq(steps.id, stepId))
            .returning();

        return {
            success: true,
            data: updatedStep,
        };
    } catch (error) {
        console.error("Failed to update step:", error);

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
            error: "Failed to update step. Please try again"
        };
    }
};

export const changeStepOrder = async (
    stepId: string,
    newPosition: string,
    token: string
): Promise<ActionResponse<StepResponse>> => {
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
                error: "Step Id is required"
            };
        }

        if (!newPosition) {
            return {
                success: false,
                error: "New position is required"
            };
        }

        const stepResponse = await getStep(stepId);
        if (!stepResponse.success) {
            return {
                success: false,
                error: "Step not found"
            };
        }

        const [updatedStep] = await db
            .update(steps)
            .set({ position: newPosition })
            .where(eq(steps.id, stepId))
            .returning();

        return {
            success: true,
            data: updatedStep,
        };
    } catch (error) {
        console.error("Failed to change step order:", error);

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
            error: "Failed to change step order. Please try again"
        };
    }
};

export const getAllStepsPublic = async (
    demoId: string
): Promise<ActionResponse<StepResponse[]>> => {
    try {
        if (!demoId) {
            return {
                success: false,
                error: "Demo Id is required"
            };
        }

        const allSteps = await db.select().from(steps).where(eq(steps.demoId, demoId));

        return {
            success: true,
            data: allSteps,
        };
    } catch (error) {
        console.error("Failed to get all steps:", error);

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
            error: "Failed to get all steps. Please try again"
        };
    }
};