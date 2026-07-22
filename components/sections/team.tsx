import Image from "next/image"
import taiaPhoto from "@/public/taia.jpg"
import { Card } from "@/components/ui/card"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { AiTeamGrid } from "@/components/sections/team-ai-grid"

export function Team() {
  return (
    <section id="team" className="bg-primary/5 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Your Engineering Team
            </h2>
            <p className="mt-3 text-muted-foreground">
              A senior engineer who uses AI as a tool — not a replacement — to ship faster without cutting corners.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-2 items-stretch">
          <ScrollReveal>
            <Card className="flex h-full flex-col items-center p-8 text-center">
              <div className="relative size-28 overflow-hidden rounded-full ring-4 ring-primary/20">
                <Image
                  src={taiaPhoto}
                  alt="Taia Tiniyara"
                  fill
                  className="object-cover"
                  sizes="112px"
                  priority
                />
              </div>
              <h3 className="mt-5 font-heading text-2xl font-bold">
                Taia Tiniyara
              </h3>
              <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                Founder &amp; Lead Engineer
              </span>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Your project is led by a senior full‑stack engineer who
                architects the solution, writes the critical code, and
                uses AI to automate the routine — so you get
                enterprise‑quality software at startup speed.
              </p>
            </Card>
          </ScrollReveal>

          <ScrollReveal>
            <Card className="flex h-full flex-col p-8">
              <div className="mb-5 text-center">
                <h3 className="font-heading text-xl font-bold">
                  Tools That Accelerate
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  AI-assisted workflows that speed up development without sacrificing quality.
                </p>
              </div>
              <AiTeamGrid />
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
