import { db } from "@/lib/db"
import { eq, and, desc, ne, sql, notInArray } from "drizzle-orm"
import { services, projects, products, posts, subscribers } from "@/lib/schema"

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
      coverUrl: posts.coverUrl,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
}

export async function getRandomPosts(count = 3, excludeIds: number[] = []) {
  const conditions = [eq(posts.status, "published")]
  if (excludeIds.length > 0) {
    conditions.push(notInArray(posts.id, excludeIds))
  }

  return db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(and(...conditions))
    .orderBy(sql`RANDOM()`)
    .limit(count)
}

export async function subscribeEmail(email: string) {
  const existing = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.email, email))
    .limit(1)

  if (existing.length > 0) {
    if (existing[0].active) return { success: false, message: "You are already subscribed." }
    await db
      .update(subscribers)
      .set({ active: 1 })
      .where(eq(subscribers.id, existing[0].id))
    return { success: true, message: "You have been re-subscribed!" }
  }

  await db.insert(subscribers).values({
    email,
    createdAt: new Date().toISOString(),
  })

  return { success: true, message: "You have been subscribed!" }
}

export async function getActiveSubscribers() {
  return db
    .select()
    .from(subscribers)
    .where(eq(subscribers.active, 1))
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
