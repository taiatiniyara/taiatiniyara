import { db } from "@/lib/db"
import { eq, and, desc, ne, sql } from "drizzle-orm"
import { services, projects, products, posts } from "@/lib/schema"

export async function getActiveServices() {
  return db.select().from(services).orderBy(services.sortOrder)
}

export async function getFeaturedProjects() {
  const featured = await db
    .select()
    .from(projects)
    .where(eq(projects.featured, 1))
    .orderBy(projects.sortOrder)

  if (featured.length > 0) return featured

  return db.select().from(projects).orderBy(projects.sortOrder)
}

export async function getPublishedProducts() {
  return db
    .select()
    .from(products)
    .orderBy(products.sortOrder)
}

export async function getProductCount() {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)

  return result[0]?.count ?? 0
}

export async function getPublishedPosts(page = 1, perPage = 9) {
  const offset = (page - 1) * perPage

  const [rows, countResult] = await Promise.all([
    db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        tags: posts.tags,
        coverUrl: posts.coverUrl,
        publishedAt: posts.publishedAt,
      })
      .from(posts)
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.publishedAt))
      .limit(perPage)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(eq(posts.status, "published")),
  ])

  return {
    posts: rows,
    total: countResult[0]?.count ?? 0,
    totalPages: Math.ceil((countResult[0]?.count ?? 0) / perPage),
  }
}

export async function getPostBySlug(slug: string) {
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1)

  return rows[0] ?? null
}

export async function getTestimonials() {
  return db
    .select({
      testimonial: projects.testimonial,
      clientName: projects.clientName,
      title: projects.title,
    })
    .from(projects)
    .where(ne(projects.testimonial, ""))
    .orderBy(projects.sortOrder)
}

export async function getRecentPosts(limit = 3) {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
}

export async function getStats() {
  const [projectCount, serviceCount, clientCountResult] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(projects),
    db.select({ count: sql<number>`count(*)` }).from(services),
    db
      .select({ count: sql<number>`count(distinct client_name)` })
      .from(projects)
      .where(ne(projects.clientName, "")),
  ])

  return {
    projectCount: projectCount[0]?.count ?? 0,
    serviceCount: serviceCount[0]?.count ?? 0,
    clientCount: clientCountResult[0]?.count ?? 0,
  }
}
