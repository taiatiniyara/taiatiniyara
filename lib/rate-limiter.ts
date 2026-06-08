const buckets = new Map<string, { count: number; resetAt: number }>()

function getBucket(key: string, maxRequests: number, windowMs: number) {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (bucket.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  bucket.count++
  return { allowed: true, remaining: maxRequests - bucket.count }
}

export function rateLimit(key: string, maxRequests = 5, windowMs = 60_000) {
  return getBucket(key, maxRequests, windowMs)
}
