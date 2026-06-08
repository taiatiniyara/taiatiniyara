import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { getStats } from "@/lib/data"
import { Briefcase, Wrench, Building2 } from "lucide-react"

export async function Stats() {
  const { projectCount, serviceCount } = await getStats()

  const stats = [
    {
      value: serviceCount,
      label: "Services Offered",
      icon: Wrench,
    },
    {
      value: projectCount,
      label: "Projects Delivered",
      icon: Briefcase,
    },
    {
      value: projectCount > 0 ? projectCount : 1,
      label: "Happy Clients",
      icon: Building2,
    },
  ]

  return (
    <section className="bg-primary/5 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-3 gap-4 divide-x divide-primary/10">
          {stats.map((stat) => (
            <ScrollReveal key={stat.label}>
              <div className="flex flex-col items-center gap-2 px-2 py-4">
                <stat.icon className="size-5 text-primary/60" />
                <span className="font-heading text-3xl font-bold text-primary sm:text-4xl">
                  {stat.value}+
                </span>
                <span className="text-xs font-medium text-muted-foreground text-center">
                  {stat.label}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
