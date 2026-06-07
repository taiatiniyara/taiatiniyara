import { NextRequest, NextResponse } from "next/server"
import { createContact } from "@/lib/data"
import { sendContactEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
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
