import { db } from "./db"
import { services, projects, products, contacts, posts } from "./schema"
import { eq, desc, and, count, like, ne, or } from "drizzle-orm"
import type { SQL } from "drizzle-orm"
import { parseTags } from "./utils"
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

function escapeLike(s: string): string {
  return s.replace(/[%_]/g, "\\$&")
}

export async function getPublishedPosts(page = 1, perPage = 9, tag?: string, search?: string) {
  const offset = (page - 1) * perPage
  const conditions: SQL[] = [eq(posts.status, "published")]
  if (tag) {
    conditions.push(like(posts.tags, `%"${escapeLike(tag)}"%`))
  }
  if (search) {
    const escaped = escapeLike(search)
    conditions.push(
      or(
        like(posts.title, `%${escaped}%`),
        like(posts.excerpt, `%${escaped}%`),
        like(posts.tags, `%${escaped}%`)
      )!
    )
  }

  const results = await db
    .select()
    .from(posts)
    .where(and(...conditions))
    .orderBy(desc(posts.publishedAt))
    .limit(perPage)
    .offset(offset)

  const [countResult] = await db
    .select({ count: count() })
    .from(posts)
    .where(and(...conditions))

  return {
    posts: results,
    total: countResult.count,
    page,
    perPage,
    totalPages: Math.ceil(countResult.count / perPage),
  }
}

export async function getAllPublishedTags(): Promise<string[]> {
  const allPosts = await db
    .select({ tags: posts.tags })
    .from(posts)
    .where(eq(posts.status, "published"))

  const tagSet = new Set<string>()
  for (const post of allPosts) {
    for (const tag of parseTags(post.tags)) {
      tagSet.add(tag)
    }
  }
  return [...tagSet].sort()
}

export async function getPostBySlug(slug: string) {
  const results = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
  return results[0] ?? null
}

export async function getRelatedPosts(slug: string, limit = 3) {
  const post = await getPostBySlug(slug)
  if (!post) return []

  const tags = parseTags(post.tags)
  if (tags.length === 0) return []

  const tagConditions = tags.map((tag) =>
    like(posts.tags, `%"${escapeLike(tag)}"%`)
  )

  return db
    .select()
    .from(posts)
    .where(and(eq(posts.status, "published"), ne(posts.slug, slug), or(...tagConditions)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
}

// Types
export type Service = InferSelectModel<typeof services>
export type Project = InferSelectModel<typeof projects>
export type Product = InferSelectModel<typeof products>
export type Post = InferSelectModel<typeof posts>
