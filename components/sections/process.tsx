import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { MessageSquare, ClipboardList, Code2, Rocket } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Step = {
  icon: LucideIcon
  step: string
  title: string
  description: string
  accent: string
}

const steps: Step[] = [
  {
    icon: MessageSquare,
    step: "01",
    title: "You tell us your vision",
    description:
      "Share your idea, goals, and constraints. We listen and ask the right questions to understand what success looks like.",
    accent: "#8b5cf6",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "We propose a plan & estimate",
    description:
      "You receive a clear scope of work, timeline, and fixed‑price estimate within 3 business days.",
    accent: "#3b82f6",
  },
  {
    icon: Code2,
    step: "03",
    title: "We build in 2‑week sprints",
    description:
      "You see working software every two weeks. Regular demos keep you in the loop and give you full control over direction.",
    accent: "#10b981",
  },
  {
    icon: Rocket,
    step: "04",
    title: "You launch & grow",
    description:
      "We ship to production, monitor performance, and remain available for ongoing support and iterations.",
    accent: "#ef4444",
  },
]

export function Process() {
  return (
    <section id="process" className="bg-muted/30 px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <div className="mb-14 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              A simple process that keeps you in control from start to finish.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-0">
          {steps.map((s, i) => (
            <StepRow key={s.step} step={s} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepRow({ step, isLast }: { step: Step; isLast: boolean }) {
  const Icon = step.icon

  return (
    <ScrollReveal>
      <div className="relative flex gap-5 sm:gap-6">
        <div className="relative flex shrink-0 flex-col items-center">
          <div
            className="relative z-10 flex size-12 items-center justify-center rounded-full text-sm font-bold"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${step.accent}25, ${step.accent}06)`,
              boxShadow: `0 0 0 1px ${step.accent}30, 0 0 14px ${step.accent}10`,
            }}
          >
            <span style={{ color: step.accent }}>{step.step}</span>
          </div>
          {!isLast && (
            <div className="w-px flex-1 min-h-14 mt-1.5 mb-1.5 bg-border/60" />
          )}
        </div>

        <div className="flex-1 pb-10 sm:pb-14 px-5 py-3 transition-all duration-300 hover:bg-muted/40">
          <div className="flex items-center gap-3">
            <Icon className="size-5 shrink-0" style={{ color: step.accent }} />
            <h3 className="text-lg font-semibold">{step.title}</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-lg">
            {step.description}
          </p>
        </div>
      </div>
    </ScrollReveal>
  )
}
