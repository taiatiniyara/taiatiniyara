import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import { ScrollToSection } from "./scroll-to-section"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent dark:from-primary/5" />
      </div>
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Custom Software,
          <br />
          <span className="text-primary">Built Right</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
          Web apps, mobile apps, and APIs — built with TypeScript and Node.js. I
          help businesses and individuals bring their software ideas to life.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/#contact">Let&apos;s Talk</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/#portfolio">See My Work</Link>
          </Button>
        </div>
        <ScrollToSection target="services" className="mt-16 inline-block animate-bounce text-muted-foreground hover:text-primary transition-colors" aria-label="Scroll to services">
          <ArrowDown className="size-5" />
        </ScrollToSection>
      </div>
    </section>
  )
}
