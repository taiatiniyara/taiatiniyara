import { Card } from "@/components/ui/card"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { getTestimonials } from "@/lib/data"
import { Quote } from "lucide-react"

export async function Testimonials() {
  const testimonials = await getTestimonials()

  if (testimonials.length === 0) return null

  return (
    <section className="bg-background px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mt-3 text-muted-foreground">
              Don&apos;t take our word for it.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <ScrollReveal key={t.testimonial}>
              <Card className="flex h-full flex-col p-6">
                <Quote className="mb-4 size-6 text-primary/40" />
                <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.testimonial}&rdquo;
                </blockquote>
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-semibold">
                    {t.clientName || "Client"}
                  </p>
                  {t.title && (
                    <p className="text-xs text-muted-foreground">{t.title}</p>
                  )}
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
