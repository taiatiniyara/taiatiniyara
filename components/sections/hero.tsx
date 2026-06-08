import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { CodeWindow } from "@/components/sections/hero-code-window"
import { ArrowRight } from "lucide-react"
import { getStats } from "@/lib/data"

export async function Hero() {
  const { projectCount } = await getStats()

  return (
    <section className="flex min-h-[85vh] items-center bg-muted/30 px-4">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1fr_auto]">
        <ScrollReveal>
          <div className="max-w-2xl space-y-6">
            <p className="text-sm font-medium tracking-wider text-primary uppercase">
              Software Engineering Studio
            </p>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              We build software that moves your business forward
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Custom web apps, mobile apps, and API development for businesses
              ready to scale — from startup to enterprise.
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link href="#contact">
                    Start a Project
                    <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="#services">Our Services</Link>
                </Button>
              </div>
              {projectCount > 0 && (
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex size-2 rounded-full bg-primary/60" aria-hidden="true" />
                  {projectCount}+ projects delivered
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <CodeWindow />
        </ScrollReveal>
      </div>
    </section>
  )
}
