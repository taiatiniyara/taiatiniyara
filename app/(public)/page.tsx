import { Hero } from "@/components/sections/hero"
import { Stats } from "@/components/sections/stats"
import { Services } from "@/components/sections/services"
import { Process } from "@/components/sections/process"
import { Portfolio } from "@/components/sections/portfolio"
import { Testimonials } from "@/components/sections/testimonials"
import { Products } from "@/components/sections/products"
import { BlogPreview } from "@/components/sections/blog-preview"
import { Contact } from "@/components/sections/contact"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Taia Tiniyara — Software Engineering Studio",
  description:
    "Custom web apps, mobile apps, and API development. We build software that moves your business forward.",
  openGraph: {
    title: "Taia Tiniyara — Software Engineering Studio",
    description:
      "Custom web apps, mobile apps, and API development. We build software that moves your business forward.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taia Tiniyara — Software Engineering Studio",
    description:
      "Custom web apps, mobile apps, and API development. We build software that moves your business forward.",
  },
}

export default async function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Process />
      <Portfolio />
      <Testimonials />
      <Products />
      <BlogPreview />
      <Contact />
    </>
  )
}
