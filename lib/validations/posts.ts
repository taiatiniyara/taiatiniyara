import { z } from "zod"

export const PostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens"),
  excerpt: z.string().max(500).default(""),
  tags: z.string().default("[]"),
  status: z.enum(["draft", "published"]).default("draft"),
  coverUrl: z.string().default(""),
  contentR2Key: z.string().default(""),
  seoTitle: z.string().max(70).default(""),
  seoDesc: z.string().max(160).default(""),
  publishedAt: z.string().default(""),
})

export type Post = z.infer<typeof PostSchema>
