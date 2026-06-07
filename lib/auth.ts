import { cookies } from "next/headers"

const SESSION_SECRET = process.env.SESSION_SECRET || "change-me-in-production"
export const COOKIE_NAME = "taiatiniyara_session"
const SESSION_TTL = 60 * 60 * 24

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  return atob(base64)
}

async function sign(payload: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(SESSION_SECRET)
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const data = encoder.encode(payload)
  const signature = await crypto.subtle.sign("HMAC", key, data)
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function hasValidSession(token: string | null): Promise<boolean> {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 2) return false
  const [payload64, signature] = parts

  const expectedSig = await sign(payload64)
  if (signature.length !== expectedSig.length) return false

  try {
    const payload = JSON.parse(base64UrlDecode(payload64))
    return payload.admin === true && payload.exp > Date.now()
  } catch {
    return false
  }
}

export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL * 1000
  const payload = JSON.stringify({ exp: expiresAt, admin: true })
  const encoded = base64UrlEncode(payload)
  const signature = await sign(encoded)
  return `${encoded}.${signature}`
}

export async function validateSession(): Promise<boolean> {
  try {
    const store = await cookies()
    const token = store.get(COOKIE_NAME)?.value ?? null
    return hasValidSession(token)
  } catch {
    return false
  }
}

export async function verifyPassword(input: string): Promise<boolean> {
  const stored = process.env.ADMIN_PASSWORD
  if (!stored) return false
  const encoder = new TextEncoder()
  const inputBuf = encoder.encode(input)
  const storedBuf = encoder.encode(stored)
  if (inputBuf.length !== storedBuf.length) return false

  let result = 0
  for (let i = 0; i < inputBuf.length; i++) {
    result |= inputBuf[i] ^ storedBuf[i]
  }
  return result === 0
}
