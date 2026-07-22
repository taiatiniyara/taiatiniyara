"use server"

import { SubscribeSchema } from "@/lib/validations/subscribers"
import { subscribeEmail } from "@/lib/data"
import { rateLimit } from "@/lib/rate-limiter"

export async function subscribe(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = SubscribeSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { allowed } = rateLimit(`subscribe:${parsed.data.email}`, 3, 60_000)
  if (!allowed) {
    return { error: "Too many attempts. Please try again later." }
  }

  return subscribeEmail(parsed.data.email)
}
