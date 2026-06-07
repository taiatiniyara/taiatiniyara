import type React from "react"
import { getServices } from "@/lib/data"
import * as LucideIcons from "lucide-react"
import { ScrollReveal } from "@/components/layout/scroll-reveal"

function getIcon(name: string): React.ComponentType<{ className?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as any
  const Icon = icons[name]
  return (typeof Icon === "function" ? Icon : icons.Code) as React.ComponentType<{ className?: string }>
}

export async function ServicesSection() {
  const services = await getServices()

  if (services.length === 0) return null

  return (
    <section id="services" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What I Do
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            I specialize in building robust, scalable software with modern tools.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = getIcon(service.icon)
            return (
              <ScrollReveal key={service.id} delay={i * 100}>
                <div className="group rounded-lg border bg-card p-6 transition-all hover:shadow-md hover:border-primary/20">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
