"use server"

import { db } from "@/lib/db"
import { posts } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { uploadToR2 } from "@/lib/r2"

export async function createPost(data: {
  title: string
  slug: string
  excerpt: string
  tags: string
  status: string
  coverUrl: string
  content: string
  seoTitle: string
  seoDesc: string
}) {
  const now = new Date().toISOString()
  let contentR2Key = ""

  if (data.content) {
    const key = `posts/${data.slug}.json`
    try {
      await uploadToR2(key, data.content, "application/json")
      contentR2Key = key
    } catch (err) {
      console.error("Failed to upload post content to R2:", err)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content, ...rest } = data
  await db.insert(posts).values({
    ...rest,
    contentR2Key,
    publishedAt: data.status === "published" ? now : "",
    createdAt: now,
    updatedAt: now,
  })
  revalidatePath("/admin/posts")
}

export async function updatePost(
  id: number,
  data: {
    title: string
    slug: string
    excerpt: string
    tags: string
    status: string
    coverUrl: string
    content: string
    seoTitle: string
    seoDesc: string
  }
) {
  const now = new Date().toISOString()
  let contentR2Key: string | undefined

  if (data.content) {
    const key = `posts/${data.slug}.json`
    try {
      await uploadToR2(key, data.content, "application/json")
      contentR2Key = key
    } catch (err) {
      console.error("Failed to upload post content to R2:", err)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content, ...rest } = data
  await db
    .update(posts)
    .set({
      ...rest,
      ...(contentR2Key ? { contentR2Key } : {}),
      publishedAt: data.status === "published" ? now : "",
      updatedAt: now,
    })
    .where(eq(posts.id, id))
  revalidatePath("/admin/posts")
}

export async function deletePost(id: number) {
  await db.delete(posts).where(eq(posts.id, id))
  revalidatePath("/admin/posts")
}
