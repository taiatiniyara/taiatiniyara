import { NextRequest, NextResponse } from "next/server"
import { verifyPassword, createSessionToken } from "@/lib/auth"

const COOKIE_NAME = "taiatiniyara_session"
const SESSION_TTL = 60 * 60 * 24

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const action = body.action

  if (action === "login") {
    const password = body.password
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password required" }, { status: 400 })
    }

    const valid = await verifyPassword(password)
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const token = createSessionToken()
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
