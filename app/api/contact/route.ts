import { NextRequest, NextResponse } from "next/server"
import { createContact } from "@/lib/data"
import { sendContactEmail } from "@/lib/email"
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter"

const RATE_LIMIT = 3
const RATE_WINDOW_MS = 15 * 60 * 1000

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const { allowed, retryAfter } = checkRateLimit(ip, RATE_LIMIT, RATE_WINDOW_MS)

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429, headers: { "retry-after": String(retryAfter) } }
    )
  }

  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      )
    }

    await createContact({ name, email, message })

    try {
      await sendContactEmail({ name, email, message })
    } catch {
      // Email failed but DB stored it — non-critical
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    )
  }
}
