import type { Metadata } from "next"
import { HeroSection } from "@/components/sections/hero"
import { ServicesSection } from "@/components/sections/services"
import { PortfolioSection } from "@/components/sections/portfolio"
import { ProductsSection } from "@/components/sections/products"
import { ContactSection } from "@/components/sections/contact"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taiatiniyara.com"

export const metadata: Metadata = {
  title: "Taia Tiniyara — Custom Software, Built Right",
  description:
    "Web apps, mobile apps, and APIs — built with TypeScript and Node.js. Taia Tiniyara is a software engineering studio helping businesses bring their ideas to life.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Taia Tiniyara — Custom Software, Built Right",
    description:
      "Web apps, mobile apps, and APIs — built with TypeScript and Node.js.",
    url: siteUrl,
    type: "website",
  },
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <ProductsSection />
      <ContactSection />
    </>
  )
}
