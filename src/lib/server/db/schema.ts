import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { user } from "./auth.schema"

export const image = pgTable("image", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    image_key: text("image_url"),
    title: text("title"),
    description: text("description"),
    ai_prompt: text("ai_prompt"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
    user_id: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export type ImageInsert = typeof image.$inferInsert
export type Image = typeof image.$inferSelect


export const book = pgTable("book", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: text("title"),
    key: text("key"),
    image_url: text("image_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    user_id: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    image_id: integer("image_id")
        .notNull()
        .references(() => image.id, { onDelete: "cascade" }),
});

export type BookInsert = typeof book.$inferInsert
export type Book = typeof book.$inferSelect


export * from './auth.schema';
