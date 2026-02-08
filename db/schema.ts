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