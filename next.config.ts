import type { NextConfig } from "next"
import "@/lib/env"

const isProd = process.env.NODE_ENV === "production"
const r2PublicUrl = process.env.R2_PUBLIC_URL ?? ""

const nextConfig: NextConfig = {
  images: r2PublicUrl
    ? {
        remotePatterns: [
          {
            protocol: "https",
            hostname: new URL(r2PublicUrl).hostname,
          },
        ],
      }
    : {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "**.r2.dev",
          },
        ],
      },

  async headers() {
    const securityHeaders: Record<string, string> = {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    }

    if (isProd) {
      securityHeaders["Strict-Transport-Security"] =
        "max-age=63072000; includeSubDomains; preload"
      securityHeaders["Content-Security-Policy"] = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' https: data:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; ")
    }

    return [
      {
        source: "/(.*)",
        headers: Object.entries(securityHeaders).map(([key, value]) => ({
          key,
          value,
        })),
      },
    ]
  },
}

export default nextConfig
