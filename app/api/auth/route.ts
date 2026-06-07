import { NextRequest, NextResponse } from "next/server"
import { verifyPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth"
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter"

const SESSION_TTL = 60 * 60 * 24
const LOGIN_RATE_LIMIT = 5
const LOGIN_RATE_WINDOW_MS = 15 * 60 * 1000

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || ""
  let body: Record<string, unknown> = {}

  if (contentType.includes("application/json")) {
    body = await request.json().catch(() => ({}))
  } else {
    const text = await request.text().catch(() => "")
    const params = new URLSearchParams(text)
    params.forEach((value, key) => {
      body[key] = value
    })
  }

  const action = body.action as string | undefined

  if (action === "login") {
    const ip = getClientIp(request)
    const { allowed, retryAfter } = checkRateLimit(ip, LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_MS)

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "retry-after": String(retryAfter) } }
      )
    }

    const password = body.password
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password required" }, { status: 400 })
    }

    const valid = await verifyPassword(password)
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const token = await createSessionToken()
    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_TTL,
      path: "/",
    })
    return response
  }

  if (action === "logout") {
    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })
    return response
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
