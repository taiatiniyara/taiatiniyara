import { getPublishedProducts } from "@/lib/data"
import { ExternalLink } from "lucide-react"
import { parseTags } from "@/lib/utils"
import { ScrollReveal } from "@/components/layout/scroll-reveal"

export async function ProductsSection() {
  const products = await getPublishedProducts()

  if (products.length === 0) return null

  return (
    <section id="products" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Products
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            SaaS tools and products built by Taia Tiniyara.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => {
            const tags = parseTags(product.techStack)
            return (
              <ScrollReveal key={product.id} delay={i * 100}>
                <div className="group flex flex-col rounded-lg border bg-card p-6 transition-all hover:shadow-md hover:border-primary/20">
                  {product.imageUrl && (
                    <div className="mb-4 flex size-16 items-center justify-center overflow-hidden rounded-lg bg-muted">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    {product.link && (
                      <a
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${product.name}`}
                        className="flex size-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  {tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
