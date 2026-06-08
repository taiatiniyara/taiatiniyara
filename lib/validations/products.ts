import { z } from "zod"

export const ProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  techStack: z.string().default("[]"),
  imageUrl: z.string().default(""),
  link: z.string().default(""),
  status: z.enum(["launched", "in-progress", "coming-soon"]).default("coming-soon"),
  featured: z.coerce.number().int().min(0).max(1).default(0),
  sortOrder: z.coerce.number().int().min(0).default(0),
})

export type Product = z.infer<typeof ProductSchema>
