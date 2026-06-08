import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { MessageSquare, ClipboardList, Code, Rocket } from "lucide-react"

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "You tell us your vision",
    description: "Share your idea, goals, and constraints. We listen and ask the right questions to understand what success looks like.",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "We propose a plan & estimate",
    description: "You receive a clear scope of work, timeline, and fixed-price estimate within 3 business days.",
  },
  {
    icon: Code,
    step: "03",
    title: "We build in 2-week sprints",
    description: "You see working software every two weeks. Regular demos keep you in the loop and give you full control over direction.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "You launch & grow",
    description: "We ship to production, monitor performance, and remain available for ongoing support and iterations.",
  },
]

export function Process() {
  return (
    <section className="bg-muted/30 px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              How We Work
            </h2>
            <p className="mt-3 text-muted-foreground">
              A simple process that keeps you in control from start to finish.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          <div className="absolute left-[23px] top-0 bottom-0 hidden w-px bg-border sm:block" aria-hidden="true" />

          <div className="space-y-12">
            {steps.map((step) => (
              <ScrollReveal key={step.step}>
                <div className="flex gap-6">
                  <div className="relative hidden shrink-0 sm:flex size-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/20">
                    {step.step}
                  </div>
                  <div className="flex-1 space-y-2 pt-0 sm:pt-2">
                    <div className="flex items-center gap-3">
                      <step.icon className="size-5 text-primary" />
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
