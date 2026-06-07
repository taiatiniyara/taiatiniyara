import { cookies } from "next/headers"
import { timingSafeEqual } from "crypto"
import { createHmac, randomBytes } from "crypto"

const SESSION_SECRET = process.env.SESSION_SECRET || "change-me-in-production"
const COOKIE_NAME = "taiatiniyara_session"
const SESSION_TTL = 60 * 60 * 24 // 24 hours

function sign(payload: string): string {
  const hmac = createHmac("sha256", SESSION_SECRET)
  hmac.update(payload)
  return hmac.digest("hex")
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString("base64url")
}

function base64UrlDecode(str: string): string {
  return Buffer.from(str, "base64url").toString()
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL * 1000
  const payload = JSON.stringify({ exp: expiresAt, admin: true })
  const encoded = base64UrlEncode(payload)
  const signature = sign(encoded)
  return `${encoded}.${signature}`
}

export function validateSession(): boolean {
  try {
    return hasValidSession(unsafeGetCookieValue())
  } catch {
    return false
  }
}

export async function getSessionCookieHeader(): Promise<string | null> {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value ?? null
}

async function unsafeGetCookieValue(): Promise<string | null> {
  return getSessionCookieHeader()
}

function hasValidSession(token: string | null): boolean {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 2) return false
  const [payload64, signature] = parts

  const expectedSig = sign(payload64)
  if (signature.length !== expectedSig.length) return false
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return false

  try {
    const payload = JSON.parse(base64UrlDecode(payload64))
    return payload.admin === true && payload.exp > Date.now()
  } catch {
    return false
  }
}

export async function verifyPassword(input: string): Promise<boolean> {
  const stored = process.env.ADMIN_PASSWORD
  if (!stored) return false
  const inputBuf = Buffer.from(input)
  const storedBuf = Buffer.from(stored)
  if (inputBuf.length !== storedBuf.length) return false
  return timingSafeEqual(inputBuf, storedBuf)
}
