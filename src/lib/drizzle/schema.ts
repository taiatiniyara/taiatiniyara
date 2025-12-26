import { boolean, json, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const blogPosts = pgTable("blog_posts", {
    id: uuid("uuid").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    excerpt: varchar("excerpt", { length: 1000 }).notNull(),
    content: varchar("content", { length: 5000 }).notNull(),
    tags: json("tags").notNull().$type<string[]>(),
    isPublished: boolean("is_published").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export const course_categories = pgTable("course_categories", {
    id: uuid("uuid").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 1000 }).notNull(),
    level: varchar("level", { length: 50 }).notNull().$type<"Beginner" | "Intermediate" | "Advanced">(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export type CourseCategory = typeof course_categories.$inferSelect;
export type NewCourseCategory = typeof course_categories.$inferInsert;

export const courses = pgTable("courses", {
    id: uuid("uuid").primaryKey().defaultRandom(),
    category_id: uuid("category_uuid").notNull().references(() => course_categories.id),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 2000 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export const userProfiles = pgTable("user_profiles", {
    id: uuid("uuid").primaryKey().defaultRandom(),
    role: varchar("role", { length: 50 }).notNull().$type<"admin" | "user">(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
