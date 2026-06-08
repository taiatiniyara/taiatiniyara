import { z } from "zod"

export const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  techStack: z.string().default("[]"),
  imageUrl: z.string().default(""),
  link: z.string().default(""),
  clientName: z.string().default(""),
  completedDate: z.string().default(""),
  testimonial: z.string().default(""),
  featured: z.coerce.number().int().min(0).max(1).default(0),
  sortOrder: z.coerce.number().int().min(0).default(0),
})

export type Project = z.infer<typeof ProjectSchema>
