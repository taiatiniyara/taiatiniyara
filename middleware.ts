import { NextRequest, NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"

const SESSION_SECRET = process.env.SESSION_SECRET || "change-me-in-production"
const COOKIE_NAME = "taiatiniyara_session"

function sign(payload: string): string {
  const hmac = createHmac("sha256", SESSION_SECRET)
  hmac.update(payload)
  return hmac.digest("hex")
}

function isValidToken(token: string): boolean {
  const parts = token.split(".")
  if (parts.length !== 2) return false
  const [payload64, signature] = parts

  const expectedSig = sign(payload64)
  if (signature.length !== expectedSig.length) return false
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return false

  try {
    const payload = JSON.parse(Buffer.from(payload64, "base64url").toString())
    return payload.admin === true && payload.exp > Date.now()
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/admin/login" || pathname === "/api/auth") {
    return NextResponse.next()
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token || !isValidToken(token)) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
