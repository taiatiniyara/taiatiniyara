"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { posts } from "@/lib/schema"
import { PostSchema } from "@/lib/validations/posts"
import { uploadToR2 } from "@/lib/r2"
import { getActiveSubscribers } from "@/lib/data"
import { sendNewPostNotification } from "@/lib/email"
import { eq } from "drizzle-orm"

async function notifySubscribers(title: string, excerpt: string, slug: string) {
  try {
    const subs = await getActiveSubscribers()
    await Promise.allSettled(
      subs.map((s) =>
        sendNewPostNotification({ email: s.email, title, excerpt, slug })
      )
    )
  } catch {
    // Don't block post creation if email fails
  }
}

export async function getPosts() {
  return db.select().from(posts).orderBy(posts.createdAt)
}

export async function getPost(id: number) {
  const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1)
  return rows[0] ?? null
}

export async function createPost(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = PostSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const now = new Date().toISOString()
  const publishedAt =
    parsed.data.status === "published" ? now : ""

  const contentJson = parsed.data.contentR2Key
  const r2Key = contentJson
    ? `posts/${parsed.data.slug}/content.json`
    : ""

  if (r2Key) {
    await uploadToR2(
      r2Key,
      Buffer.from(contentJson, "utf-8"),
      "application/json",
    )
  }

  await db.insert(posts).values({
    ...parsed.data,
    contentR2Key: r2Key,
    publishedAt,
    createdAt: now,
    updatedAt: now,
  })

  if (parsed.data.status === "published") {
    notifySubscribers(parsed.data.title, parsed.data.excerpt, parsed.data.slug)
  }

  revalidatePath("/admin/posts")
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/blog", "layout")
  revalidatePath("/sitemap.xml")
  return { success: true }
}

export async function updatePost(id: number, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = PostSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const existing = await getPost(id)
  if (!existing) return { error: "Post not found" }

  const now = new Date().toISOString()
  const publishedAt =
    parsed.data.status === "published" && !existing.publishedAt ? now : existing.publishedAt

  const contentJson = parsed.data.contentR2Key
  const r2Key = contentJson
    ? `posts/${parsed.data.slug}/content.json`
    : existing.contentR2Key

  if (contentJson) {
    await uploadToR2(
      r2Key,
      Buffer.from(contentJson, "utf-8"),
      "application/json",
    )
  }

  await db
    .update(posts)
    .set({ ...parsed.data, contentR2Key: r2Key, publishedAt, updatedAt: now })
    .where(eq(posts.id, id))

  if (parsed.data.status === "published" && existing.status !== "published") {
    notifySubscribers(parsed.data.title, parsed.data.excerpt, parsed.data.slug)
  }

  revalidatePath("/admin/posts")
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/blog", "layout")
  revalidatePath("/sitemap.xml")
  return { success: true }
}

export async function deletePost(id: number) {
  await db.delete(posts).where(eq(posts.id, id))
  revalidatePath("/admin/posts")
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/blog", "layout")
  revalidatePath("/sitemap.xml")
  return { success: true }
}
