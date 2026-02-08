import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").unique().notNull(),
    email: text("email").unique().notNull().unique(),
    password: text("password").notNull(),
    avatar_url: text("avatar_url"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
})

export const demos = pgTable("demos", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: varchar("slug", { length: 24 }).notNull(),
    description: text("description"),
    userId: uuid("userId").references(() => users.id).notNull(),
    isPublic: boolean("is_public").default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
})

export const steps = pgTable("steps", {
    id: uuid("id").defaultRandom().primaryKey(),
    demoId: uuid("demoId").notNull().references(() => demos.id, { onDelete: "cascade" }),
    title: text("title"),
    description: text("description"),
    imageUrl: text("image_url").notNull(),
    position: text("position").notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
})

export const hotspots = pgTable("hotspots", {
    id: uuid("id").defaultRandom().primaryKey(),
    stepId: uuid("step_id").notNull().references(() => steps.id, { onDelete: "cascade" }),
    x: text("x").notNull(),
    y: text("y").notNull(),
    width: text("width").notNull(),
    height: text("height").notNull(),
    color: text("color").notNull(),
    tooltipText: text("tooltip_text"),
    tooltipPlacement: text("tooltip_placement"),
    targetStepId: uuid("target_step_id"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
})

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertStep = typeof steps.$inferInsert;
export type SelectStep = typeof steps.$inferSelect;
export type InsertDemo = typeof demos.$inferInsert;
export type SelectDemo = typeof demos.$inferSelect;
export type InsertHotspots = typeof hotspots.$inferInsert;
export type SelectHotspots = typeof hotspots.$inferSelect;