import { z } from "zod"

export const ServiceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(1000),
  icon: z.string().min(1, "Icon is required"),
  sortOrder: z.coerce.number().int().min(0).default(0),
})

export type Service = z.infer<typeof ServiceSchema>
