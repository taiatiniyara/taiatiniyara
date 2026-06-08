import { Card } from "@/components/ui/card"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { getActiveServices } from "@/lib/data"
import { Code, Server, Globe, Smartphone, Database, Shield, type LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Code: Code, Server: Server, Globe: Globe,
  Smartphone: Smartphone, Database: Database, Shield: Shield,
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
              What We Do
            </h2>
            <p className="mt-3 text-muted-foreground">
              End-to-end software development services tailored to your needs.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = iconMap[service.icon] ?? Code
            return (
              <ScrollReveal key={service.id}>
                <Card className="p-6 hover:border-primary/40 hover:shadow-sm transition-all duration-200">
                  <Icon className="size-8 text-primary mb-3" />
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
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
