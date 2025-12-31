import { boolean, integer, json, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: varchar("description", { length: 1000 }).notNull(),
    technologies: json("technologies").notNull().$type<string[]>(),
    tags: json("tags").notNull().$type<string[]>(),
    repo_url: varchar("repo_url", { length: 500 }),
    live_url: varchar("live_url", { length: 500 }),
    img_url: varchar("img_url", { length: 500 }),
    is_published: boolean("is_published").notNull().default(false),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export const blogPosts = pgTable("blog_posts", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    excerpt: varchar("excerpt", { length: 1000 }).notNull(),
    content: text("content").notNull(),
    tags: json("tags").notNull().$type<string[]>(),
    img_url: varchar("img_url", { length: 500 }),
    is_published: boolean("is_published").notNull().default(false),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export const course_categories = pgTable("course_categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 1000 }).notNull(),
    level: varchar("level", { length: 50 }).notNull().$type<"Beginner" | "Intermediate" | "Advanced">(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
export type CourseCategory = typeof course_categories.$inferSelect;
export type NewCourseCategory = typeof course_categories.$inferInsert;

export const courses = pgTable("courses", {
    id: uuid("id").primaryKey().defaultRandom(),
    category_id: uuid("category_id").notNull().references(() => course_categories.id),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    img_url: varchar("img_url", { length: 500 }),
    tags: json("tags").notNull().$type<string[]>(),
    technologies: json("technologies").notNull().$type<string[]>(),
    description: varchar("description", { length: 2000 }).notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export const lessons = pgTable("lessons", {
    id: uuid("id").primaryKey().defaultRandom(),
    course_id: uuid("course_id").notNull().references(() => courses.id),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    duration_minutes: integer("duration_minutes").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;

export const userProfiles = pgTable("user_profiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    role: varchar("role", { length: 50 }).notNull().$type<"admin" | "user">(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export const enrollments = pgTable("enrollments", {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id").notNull().references(() => userProfiles.id),
    course_id: uuid("course_id").notNull().references(() => courses.id),
    enrolled_at: timestamp("enrolled_at").notNull().defaultNow(),
    review: varchar("review", { length: 2000 }),
    rating: integer("rating"),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
})
export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;

export const progressTracking = pgTable("progress_tracking", {
    id: uuid("id").primaryKey().defaultRandom(),
    enrollment_id: uuid("enrollment_id").notNull().references(() => enrollments.id),
    lesson_id: uuid("lesson_id").notNull().references(() => lessons.id),
    is_completed: boolean("is_completed").notNull().default(false),
    completed_at: timestamp("completed_at"),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
export type ProgressTracking = typeof progressTracking.$inferSelect;
export type NewProgressTracking = typeof progressTracking.$inferInsert;