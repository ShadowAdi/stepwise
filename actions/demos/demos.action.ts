"use server"

import { db } from "@/db";
import { demos, steps } from "@/db/schema";
import { getUserIdFromToken } from "@/helper/get-user-from-id";
import { ensureUniqueSlug, generateSlug } from "@/helper/slug.helper";
import { ActionResponse, CreateDemoDTO, DemoQueryParams, DemoResponse, DemoListResponse, UpdateDemoDTO } from "@/types";
import { eq, and, or, like, desc, asc, sql, count } from "drizzle-orm";


export const createDemo = async (
    payload: Omit<CreateDemoDTO, "userId" | "slug">,
    token: string
): Promise<ActionResponse<DemoResponse>> => {
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

        if (!payload.title) {
            return {
                success: false,
                error: "Title is required"
            };
        }

        // Generate a unique slug from title
        const baseSlug = generateSlug(payload.title);
        const slug = await ensureUniqueSlug(baseSlug, authResult.userId);

        const [demo] = await db.insert(demos).values({
            title: payload.title,
            slug: slug,
            description: payload.description,
            userId: authResult.userId,
            isPublic: payload.isPublic ?? false,
        }).returning();

        return {
            success: true,
            data: {
                ...demo,
                isPublic: demo.isPublic ?? false
            }
        };
    } catch (error) {
        console.error("Failed to create demo:", error);

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
            error: "Failed to create demo. Please try again"
        };
    }
};

export const getUserDemos = async (
    token: string,
    params?: DemoQueryParams
): Promise<ActionResponse<DemoListResponse>> => {
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

        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const offset = (page - 1) * limit;
        const sortBy = params?.sortBy || 'createdAt';
        const sortOrder = params?.sortOrder || 'desc';

        const conditions = [eq(demos.userId, authResult.userId)];

        if (params?.search) {
            conditions.push(
                or(
                    like(demos.title, `%${params.search}%`),
                    like(demos.description, `%${params.search}%`)
                )!
            );
        }

        if (params?.isPublic !== undefined) {
            conditions.push(eq(demos.isPublic, params.isPublic));
        }

        const [{ count: total }] = await db
            .select({ count: count() })
            .from(demos)
            .where(and(...conditions));

        const orderByColumn = sortBy === 'title' ? demos.title : 
                             sortBy === 'updatedAt' ? demos.updatedAt : 
                             demos.createdAt;
        
        const demosData = await db
            .select()
            .from(demos)
            .where(and(...conditions))
            .orderBy(sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn))
            .limit(limit)
            .offset(offset);

        return {
            success: true,
            data: {
                demos: demosData.map(demo => ({
                    ...demo,
                    isPublic: demo.isPublic ?? false
                })),
                total: Number(total),
                page,
                limit
            }
        };
    } catch (error) {
        console.error("Failed to get user demos:", error);

        if (error instanceof Error && error.message.includes("connection")) {
            return {
                success: false,
                error: "Database connection failed. Please try again later"
            };
        }

        return {
            success: false,
            error: "Failed to fetch demos. Please try again"
        };
    }
};

export const getPublicDemos = async (
    params?: DemoQueryParams
): Promise<ActionResponse<DemoListResponse>> => {
    try {
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const offset = (page - 1) * limit;
        const sortBy = params?.sortBy || 'createdAt';
        const sortOrder = params?.sortOrder || 'desc';

        const conditions = [eq(demos.isPublic, true)];

        if (params?.search) {
            conditions.push(
                or(
                    like(demos.title, `%${params.search}%`),
                    like(demos.description, `%${params.search}%`)
                )!
            );
        }

        const [{ count: total }] = await db
            .select({ count: count() })
            .from(demos)
            .where(and(...conditions));

        const orderByColumn = sortBy === 'title' ? demos.title : 
                             sortBy === 'updatedAt' ? demos.updatedAt : 
                             demos.createdAt;
        
        const demosData = await db
            .select()
            .from(demos)
            .where(and(...conditions))
            .orderBy(sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn))
            .limit(limit)
            .offset(offset);

        return {
            success: true,
            data: {
                demos: demosData.map(demo => ({
                    ...demo,
                    isPublic: demo.isPublic ?? false
                })),
                total: Number(total),
                page,
                limit
            }
        };
    } catch (error) {
        console.error("Failed to get public demos:", error);

        if (error instanceof Error && error.message.includes("connection")) {
            return {
                success: false,
                error: "Database connection failed. Please try again later"
            };
        }

        return {
            success: false,
            error: "Failed to fetch public demos. Please try again"
        };
    }
};

export const getDemoById = async (
    idOrSlug: string,
    token?: string
): Promise<ActionResponse<DemoResponse>> => {
    try {
        let userId: string | undefined;

        if (token) {
            const authResult = await getUserIdFromToken(token);
            if (authResult.success) {
                userId = authResult.userId;
            }
        }

        const [demo] = await db
            .select()
            .from(demos)
            .where(
                or(
                    eq(demos.id, idOrSlug),
                    eq(demos.slug, idOrSlug)
                )!
            )
            .limit(1);

        if (!demo) {
            return {
                success: false,
                error: "Demo not found"
            };
        }

        if (!demo.isPublic && demo.userId !== userId) {
            return {
                success: false,
                error: "You don't have permission to view this demo"
            };
        }

        return {
            success: true,
            data: {
                ...demo,
                isPublic: demo.isPublic ?? false
            }
        };
    } catch (error) {
        console.error("Failed to get demo:", error);

        if (error instanceof Error && error.message.includes("connection")) {
            return {
                success: false,
                error: "Database connection failed. Please try again later"
            };
        }

        return {
            success: false,
            error: "Failed to fetch demo. Please try again"
        };
    }
};

export const getDemoWithStepsCount = async (
    idOrSlug: string,
    token?: string
): Promise<ActionResponse<DemoResponse & { stepsCount: number }>> => {
    try {
        let userId: string | undefined;

        if (token) {
            const authResult = await getUserIdFromToken(token);
            if (authResult.success) {
                userId = authResult.userId;
            }
        }

        const [demo] = await db
            .select()
            .from(demos)
            .where(
                or(
                    eq(demos.id, idOrSlug),
                    eq(demos.slug, idOrSlug)
                )!
            )
            .limit(1);

        if (!demo) {
            return {
                success: false,
                error: "Demo not found"
            };
        }

        if (!demo.isPublic && demo.userId !== userId) {
            return {
                success: false,
                error: "You don't have permission to view this demo"
            };
        }

        const [{ count: stepsCount }] = await db
            .select({ count: count() })
            .from(steps)
            .where(eq(steps.demoId, demo.id));

        return {
            success: true,
            data: {
                ...demo,
                isPublic: demo.isPublic ?? false,
                stepsCount: Number(stepsCount)
            }
        };
    } catch (error) {
        console.error("Failed to get demo with steps:", error);

        if (error instanceof Error && error.message.includes("connection")) {
            return {
                success: false,
                error: "Database connection failed. Please try again later"
            };
        }

        return {
            success: false,
            error: "Failed to fetch demo. Please try again"
        };
    }
};

export const updateDemo = async (
    demoId: string,
    payload: UpdateDemoDTO,
    token: string
): Promise<ActionResponse<DemoResponse>> => {
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

        const [existingDemo] = await db
            .select()
            .from(demos)
            .where(eq(demos.id, demoId))
            .limit(1);

        if (!existingDemo) {
            return {
                success: false,
                error: "Demo not found"
            };
        }

        if (existingDemo.userId !== authResult.userId) {
            return {
                success: false,
                error: "You don't have permission to update this demo"
            };
        }

        const [updatedDemo] = await db
            .update(demos)
            .set({
                ...payload,
            })
            .where(eq(demos.id, demoId))
            .returning();

        return {
            success: true,
            data: {
                ...updatedDemo,
                isPublic: updatedDemo.isPublic ?? false
            }
        };
    } catch (error) {
        console.error("Failed to update demo:", error);

        if (error instanceof Error) {
            if (error.message.includes("unique") && error.message.includes("slug")) {
                return {
                    success: false,
                    error: "A demo with this slug already exists"
                };
            }
            if (error.message.includes("connection")) {
                return {
                    success: false,
                    error: "Database connection failed. Please try again later"
                };
            }
        }

        return {
            success: false,
            error: "Failed to update demo. Please try again"
        };
    }
};

export const deleteDemo = async (
    demoId: string,
    token: string
): Promise<ActionResponse<void>> => {
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

        const [existingDemo] = await db
            .select()
            .from(demos)
            .where(eq(demos.id, demoId))
            .limit(1);

        if (!existingDemo) {
            return {
                success: false,
                error: "Demo not found"
            };
        }

        if (existingDemo.userId !== authResult.userId) {
            return {
                success: false,
                error: "You don't have permission to delete this demo"
            };
        }

        await db.delete(demos).where(eq(demos.id, demoId));

        return {
            success: true,
            data: undefined
        };
    } catch (error) {
        console.error("Failed to delete demo:", error);

        if (error instanceof Error && error.message.includes("connection")) {
            return {
                success: false,
                error: "Database connection failed. Please try again later"
            };
        }

        return {
            success: false,
            error: "Failed to delete demo. Please try again"
        };
    }
};

export const toggleDemoVisibility = async (
    demoId: string,
    token: string
): Promise<ActionResponse<DemoResponse>> => {
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

        const [existingDemo] = await db
            .select()
            .from(demos)
            .where(eq(demos.id, demoId))
            .limit(1);

        if (!existingDemo) {
            return {
                success: false,
                error: "Demo not found"
            };
        }

        if (existingDemo.userId !== authResult.userId) {
            return {
                success: false,
                error: "You don't have permission to modify this demo"
            };
        }

        const [updatedDemo] = await db
            .update(demos)
            .set({
                isPublic: !existingDemo.isPublic,
            })
            .where(eq(demos.id, demoId))
            .returning();

        return {
            success: true,
            data: {
                ...updatedDemo,
                isPublic: updatedDemo.isPublic ?? false
            }
        };
    } catch (error) {
        console.error("Failed to toggle demo visibility:", error);

        if (error instanceof Error && error.message.includes("connection")) {
            return {
                success: false,
                error: "Database connection failed. Please try again later"
            };
        }

        return {
            success: false,
            error: "Failed to update demo visibility. Please try again"
        };
    }
};

export const duplicateDemo = async (
    demoId: string,
    token: string
): Promise<ActionResponse<DemoResponse>> => {
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

        const [originalDemo] = await db
            .select()
            .from(demos)
            .where(eq(demos.id, demoId))
            .limit(1);

        if (!originalDemo) {
            return {
                success: false,
                error: "Demo not found"
            };
        }

        if (!originalDemo.isPublic && originalDemo.userId !== authResult.userId) {
            return {
                success: false,
                error: "You don't have permission to duplicate this demo"
            };
        }

        // Generate slug from new title
        const newTitle = `${originalDemo.title} (Copy)`;
        const baseSlug = generateSlug(newTitle);
        const newSlug = await ensureUniqueSlug(baseSlug, authResult.userId);
        const [duplicatedDemo] = await db.insert(demos).values({
            title: newTitle,
            slug: newSlug,
            description: originalDemo.description,
            userId: authResult.userId,
            isPublic: false, // Always create as private
        }).returning();

        return {
            success: true,
            data: {
                ...duplicatedDemo,
                isPublic: duplicatedDemo.isPublic ?? false
            }
        };
    } catch (error) {
        console.error("Failed to duplicate demo:", error);

        if (error instanceof Error && error.message.includes("connection")) {
            return {
                success: false,
                error: "Database connection failed. Please try again later"
            };
        }

        return {
            success: false,
            error: "Failed to duplicate demo. Please try again"
        };
    }
};
