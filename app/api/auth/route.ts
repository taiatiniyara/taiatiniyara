import { NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limiter"
import {
  sessionCookieHeader,
  clearSessionCookieHeader,
} from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === "/api/auth") {
    // Login
    const rl = rateLimit("auth", 5, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many attempts" }, { status: 429 })
    }

    const body = await req.json()
    const { password } = body

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.headers.set("Set-Cookie", await sessionCookieHeader())
    return response
  }

  // Logout
  const response = NextResponse.json({ success: true })
  response.headers.set("Set-Cookie", clearSessionCookieHeader())
  return response
}
