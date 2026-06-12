import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { getPublishedProducts } from "@/lib/data"
import { safeJsonParse } from "@/lib/utils"
import { ExternalLink, Star, Rocket } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export async function Products() {
  const products = await getPublishedProducts()

  if (products.length === 0) return null

  return (
    <section id="products" className="bg-background px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Tools to Accelerate Your Growth
            </h2>
            <p className="mt-3 text-muted-foreground">
              Ready‑to‑use SaaS tools that help you move faster.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ScrollReveal key={product.id}>
              <Card className="overflow-hidden flex flex-col pt-0 hover:border-primary/40 hover:shadow-sm transition-all duration-200">
                {product.imageUrl ? (
                  <div className="relative h-48 bg-muted">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center bg-muted">
                    <Rocket className="size-8 text-muted-foreground/30" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{product.name}</h3>
                    {product.featured === 1 && (
                      <Star className="size-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {product.status}
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground flex-1 line-clamp-3">
                    {product.description}
                  </p>

                  {product.techStack && product.techStack !== "[]" && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {safeJsonParse<string[]>(product.techStack, []).map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {product.link && (
                    <Button variant="ghost" size="sm" className="mt-3 w-full" asChild>
                      <Link href={product.link} target="_blank" rel="noopener noreferrer nofollow">
                        <ExternalLink className="size-3.5 mr-1" />
                        Learn More
                      </Link>
                    </Button>
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
