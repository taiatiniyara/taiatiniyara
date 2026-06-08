const SECRET = process.env.SESSION_SECRET ?? "change-me-in-production"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

async function sign(payload: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function createSessionCookie(): Promise<string> {
  const value = JSON.stringify({ admin: true, createdAt: Date.now() })
  const signature = await sign(value)
  return `${Buffer.from(value).toString("base64")}.${signature}`
}

export async function verifySessionCookie(cookie: string): Promise<boolean> {
  try {
    const [encoded, signature] = cookie.split(".")
    if (!encoded || !signature) return false

    const payload = Buffer.from(encoded, "base64").toString()
    const expected = await sign(payload)
    if (signature !== expected) return false

    const decoded = JSON.parse(payload)
    const age = Date.now() - decoded.createdAt
    return age < MAX_AGE * 1000
  } catch {
    return false
  }
}

export async function sessionCookieHeader(): Promise<string> {
  const cookie = await createSessionCookie()
  return `session=${cookie}; HttpOnly; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax`
}

export function clearSessionCookieHeader(): string {
  return "session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
}
