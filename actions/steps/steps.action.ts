import { getUserIdFromToken } from "@/helper/get-user-from-id";
import { ActionResponse, CreateStepDTO, StepResponse } from "@/types";
import { getDemoById } from "../demos/demos.action";
import { db } from "@/db";
import { steps } from "@/db/schema";
import { eq } from "drizzle-orm";

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

        const allSteps = await db.select().from(steps).where(eq(steps.demoId,demoId))

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


        const [step] = await db.select().from(steps).where(eq(steps.id,stepId)).limit(1)

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