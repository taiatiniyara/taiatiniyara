import { z } from "zod"

export const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  projectType: z.string().optional(),
  timeline: z.string().optional(),
  budgetRange: z.string().optional(),
  message: z.string().min(1, "Message is required").max(5000),
})

export type Contact = z.infer<typeof ContactSchema>
