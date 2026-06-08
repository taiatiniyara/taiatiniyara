import type { NextConfig } from "next"

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
}

export default nextConfig
