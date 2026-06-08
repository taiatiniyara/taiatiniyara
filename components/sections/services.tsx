import { Card } from "@/components/ui/card"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { getActiveServices } from "@/lib/data"
import {
  Code, Server, Globe, Smartphone, Database, Shield,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Code, Server, Globe, Smartphone, Database, Shield,
}

const accentMap: Record<string, string> = {
  Code: "#8b5cf6",
  Smartphone: "#3b82f6",
  Server: "#10b981",
  Database: "#f59e0b",
  Globe: "#ec4899",
  Shield: "#06b6d4",
}

export async function Services() {
  const services = await getActiveServices()

  if (services.length === 0) return null

  return (
    <section id="services" className="bg-background px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              How We Help You Grow
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything you need to take your idea from concept to launch — and beyond.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = iconMap[service.icon] ?? Code
            const accent = accentMap[service.icon] ?? "#8b5cf6"

            return (
              <ScrollReveal key={service.id}>
                <Card
                  className="group relative flex flex-col overflow-hidden p-6
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5
                    hover:border-border/80"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: accent }}
                  />

                  <div
                    className="mb-4 flex size-11 items-center justify-center rounded-none transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${accent}18, ${accent}08)`,
                      boxShadow: `0 0 0 1px ${accent}15, 0 4px 12px ${accent}08`,
                    }}
                  >
                    <Icon className="size-5" style={{ color: accent }} />
                  </div>

                  <h3 className="font-semibold text-base">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </Card>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
