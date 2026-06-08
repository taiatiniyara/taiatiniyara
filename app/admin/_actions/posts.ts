"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { posts } from "@/lib/schema"
import { PostSchema } from "@/lib/validations/posts"
import { eq } from "drizzle-orm"

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

  await db.insert(posts).values({
    ...parsed.data,
    publishedAt,
    createdAt: now,
    updatedAt: now,
  })

  revalidatePath("/admin/posts")
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

  await db
    .update(posts)
    .set({ ...parsed.data, publishedAt, updatedAt: now })
    .where(eq(posts.id, id))

  revalidatePath("/admin/posts")
  return { success: true }
}

export async function deletePost(id: number) {
  await db.delete(posts).where(eq(posts.id, id))
  revalidatePath("/admin/posts")
  return { success: true }
}
