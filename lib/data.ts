import { db } from "./db"
import { services, projects, products, contacts, posts } from "./schema"
import { eq, desc, and, count } from "drizzle-orm"
import type { InferSelectModel } from "drizzle-orm"

// --- Services ---
export async function getServices() {
  return db.select().from(services).orderBy(services.sortOrder)
}

// --- Projects ---
export async function getProjects() {
  return db.select().from(projects).orderBy(desc(projects.createdAt))
}

export async function getFeaturedProjects() {
  return db
    .select()
    .from(projects)
    .where(eq(projects.featured, 1))
    .orderBy(desc(projects.createdAt))
}

// --- Products ---
export async function getProducts() {
  return db.select().from(products).orderBy(desc(products.createdAt))
}

export async function getPublishedProducts() {
  return db
    .select()
    .from(products)
    .where(eq(products.status, "launched"))
    .orderBy(desc(products.createdAt))
}

export async function getLaunchedProductCount() {
  const [result] = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.status, "launched"))
  return result.count
}

// --- Contacts ---
export async function getContacts() {
  return db.select().from(contacts).orderBy(desc(contacts.createdAt))
}

export async function createContact(data: {
  name: string
  email: string
  message: string
}) {
  return db.insert(contacts).values({
    ...data,
    createdAt: new Date().toISOString(),
  })
}

// --- Posts ---
export async function getPosts() {
  return db.select().from(posts).orderBy(desc(posts.createdAt))
}

export async function getPublishedPosts(page = 1, perPage = 9) {
  const offset = (page - 1) * perPage
  const results = await db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(perPage)
    .offset(offset)

  const [countResult] = await db
    .select({ count: count() })
    .from(posts)
    .where(eq(posts.status, "published"))

  return {
    posts: results,
    total: countResult.count,
    page,
    perPage,
    totalPages: Math.ceil(countResult.count / perPage),
  }
}

export async function getPostBySlug(slug: string) {
  const results = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
  return results[0] ?? null
}

// Types
export type Service = InferSelectModel<typeof services>
export type Project = InferSelectModel<typeof projects>
export type Product = InferSelectModel<typeof products>
export type Post = InferSelectModel<typeof posts>
