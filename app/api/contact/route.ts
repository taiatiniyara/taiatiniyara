import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { contacts } from "@/lib/schema"
import { ContactSchema } from "@/lib/validations/contacts"
import { sendContactNotification } from "@/lib/email"
import { rateLimit } from "@/lib/rate-limiter"

export async function POST(req: NextRequest) {
  const rl = rateLimit("contact", 3, 60_000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a moment." },
      { status: 429 },
    )
  }

  const formData = await req.formData()
  const raw = Object.fromEntries(formData)

  const parsed = ContactSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const now = new Date().toISOString()

  await db.insert(contacts).values({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    projectType: parsed.data.projectType ?? "",
    timeline: parsed.data.timeline ?? "",
    budgetRange: parsed.data.budgetRange ?? "",
    isRead: 0,
    createdAt: now,
    updatedAt: now,
  })

  // Send notification email (fire and forget)
  sendContactNotification(parsed.data).catch(() => {
    // Email failure is non-critical
  })

  return NextResponse.json({ success: true })
}
