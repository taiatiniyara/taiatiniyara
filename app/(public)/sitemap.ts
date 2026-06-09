import type { MetadataRoute } from "next"
import { db } from "@/lib/db"
import { posts } from "@/lib/schema"
import { eq } from "drizzle-orm"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  const publishedPosts = await db
    .select({
      slug: posts.slug,
      updatedAt: posts.updatedAt,
      publishedAt: posts.publishedAt,
      coverUrl: posts.coverUrl,
    })
    .from(posts)
    .where(eq(posts.status, "published"))

  const postEntries: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt || new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    ...(post.coverUrl
      ? { images: [post.coverUrl] }
      : {}),
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...postEntries,
  ]
}
