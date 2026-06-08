import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySessionCookie } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get("session")?.value

    if (!session || !(await verifySessionCookie(session))) {
      const loginUrl = new URL("/admin/login", request.url)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.set("session", "", { maxAge: 0 })
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
