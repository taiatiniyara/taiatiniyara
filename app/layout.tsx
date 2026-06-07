import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { getLaunchedProductCount } from "@/lib/data"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taiatiniyara.com"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Taia Tiniyara — Custom Software, Built Right",
    template: "%s — Taia Tiniyara",
  },
  description:
    "Web apps, mobile apps, and APIs — built with TypeScript and Node.js. Taia Tiniyara is a software engineering studio.",
  keywords: [
    "software engineering",
    "web development",
    "mobile apps",
    "API development",
    "TypeScript",
    "Node.js",
  ],
  authors: [{ name: "Taia Tiniyara" }],
  creator: "Taia Tiniyara",
  publisher: "Taia Tiniyara, LLC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Taia Tiniyara",
    title: "Taia Tiniyara — Custom Software, Built Right",
    description:
      "Web apps, mobile apps, and APIs — built with TypeScript and Node.js.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taia Tiniyara — Custom Software, Built Right",
    description:
      "Web apps, mobile apps, and APIs — built with TypeScript and Node.js.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Taia Tiniyara",
  url: siteUrl,
  description:
    "Software engineering studio building web apps, mobile apps, and APIs with TypeScript and Node.js.",
  foundingDate: "2025",
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@taiatiniyara.com",
    contactType: "customer service",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const productCount = await getLaunchedProductCount()

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth h-full antialiased [scroll-padding-top:80px]`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium focus:outline-none"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <Navbar productCount={productCount} />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
