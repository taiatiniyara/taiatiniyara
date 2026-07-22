import { z } from "zod"

export const SubscribeSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
})

export type Subscribe = z.infer<typeof SubscribeSchema>
