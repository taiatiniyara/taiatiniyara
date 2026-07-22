import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
})

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  techStack: text("tech_stack").notNull().default("[]"),
  imageUrl: text("image_url").notNull().default(""),
  link: text("link").notNull().default(""),
  clientName: text("client_name").notNull().default(""),
  completedDate: text("completed_date").notNull().default(""),
  testimonial: text("testimonial").notNull().default(""),
  featured: integer("featured").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
})

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  techStack: text("tech_stack").notNull().default("[]"),
  imageUrl: text("image_url").notNull().default(""),
  link: text("link").notNull().default(""),
  status: text("status").notNull().default("coming-soon"),
  featured: integer("featured").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
})

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  projectType: text("project_type").notNull().default(""),
  timeline: text("timeline").notNull().default(""),
  budgetRange: text("budget_range").notNull().default(""),
  isRead: integer("is_read").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
})

export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  active: integer("active").notNull().default(1),
  createdAt: text("created_at").notNull(),
})

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull().default(""),
  tags: text("tags").notNull().default("[]"),
  status: text("status").notNull().default("draft"),
  coverUrl: text("cover_url").notNull().default(""),
  contentR2Key: text("content_r2_key").notNull().default(""),
  seoTitle: text("seo_title").notNull().default(""),
  seoDesc: text("seo_desc").notNull().default(""),
  publishedAt: text("published_at").notNull().default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
})
