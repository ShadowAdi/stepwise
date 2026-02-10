'use server'

import { ActionResponse, CreateStepDTO, StepResponse, CreateHotspotDTO, HotspotResponse } from "@/types";
import { createStep } from "./steps.action";
import { createHotspot } from "../hotspot/hotspot.action";

export interface CreateStepWithHotspotsDTO extends CreateStepDTO {
    hotspots?: Omit<CreateHotspotDTO, 'stepId'>[];
}

export interface StepWithHotspotsResponse extends StepResponse {
    hotspots: HotspotResponse[];
}

/**
 * Creates a step and optionally creates multiple hotspots for it in one operation
 * @param payload - Step data with optional array of hotspots
 * @param token - Authentication token
 * @param demoId - Demo ID the step belongs to
 * @returns The created step with its hotspots
 */
export const createStepWithHotspots = async (
    payload: CreateStepWithHotspotsDTO,
    token: string,
    demoId: string
): Promise<ActionResponse<StepWithHotspotsResponse>> => {
    try {
        // First, create the step
        const stepResult = await createStep(
            {
                title: payload.title,
                description: payload.description,
                imageUrl: payload.imageUrl,
                position: payload.position,
                demoId: payload.demoId
            },
            token,
            demoId
        );

        if (!stepResult.success || !stepResult.data) {
            return {
                success: false,
                error: (!stepResult.success ? stepResult.error : undefined) || "Failed to create step"
            };
        }

        const createdStep = stepResult.data;
        const createdHotspots: HotspotResponse[] = [];

        // If hotspots are provided, create them
        if (payload.hotspots && payload.hotspots.length > 0) {
            for (const hotspotData of payload.hotspots) {
                const hotspotResult = await createHotspot(
                    {
                        ...hotspotData,
                        stepId: createdStep.id
                    },
                    token
                );

                if (hotspotResult.success && hotspotResult.data) {
                    createdHotspots.push(hotspotResult.data);
                } else {
                    // Log error but continue with other hotspots
                    console.error(`Failed to create hotspot: ${'error' in hotspotResult ? hotspotResult.error : 'Unknown error'}`);
                }
            }
        }

        return {
            success: true,
            data: {
                ...createdStep,
                hotspots: createdHotspots
            }
        };
    } catch (error) {
        console.error("Failed to create step with hotspots:", error);
        return {
            success: false,
            error: "Failed to create step with hotspots. Please try again"
        };
    }
};
