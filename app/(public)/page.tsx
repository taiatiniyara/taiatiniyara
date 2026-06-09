import { Hero } from "@/components/sections/hero"
import { Stats } from "@/components/sections/stats"
import { Services } from "@/components/sections/services"
import { Process } from "@/components/sections/process"
import { Team } from "@/components/sections/team"
import { Portfolio } from "@/components/sections/portfolio"
import { Testimonials } from "@/components/sections/testimonials"
import { Products } from "@/components/sections/products"
import { BlogPreview } from "@/components/sections/blog-preview"
import { Contact } from "@/components/sections/contact"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Taia Tiniyara — Software Engineering Studio",
  description:
    "Custom web apps, mobile apps, and API development built around your goals. Turn your idea into software that grows your business.",
  openGraph: {
    title: "Taia Tiniyara — Software Engineering Studio",
    description:
      "Custom web apps, mobile apps, and API development built around your goals. Turn your idea into software that grows your business.",
    type: "website",
    images: [{ url: "/taia.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taia Tiniyara — Software Engineering Studio",
    description:
      "Custom web apps, mobile apps, and API development built around your goals. Turn your idea into software that grows your business.",
    images: ["/taia.jpg"],
  },
  alternates: {
    canonical: "/",
  },
}

export default async function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Process />
      <Team />
      <Portfolio />
      <Testimonials />
      <Products />
      <BlogPreview />
      <Contact />
    </>
  )
}
