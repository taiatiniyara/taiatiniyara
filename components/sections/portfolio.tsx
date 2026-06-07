import { getFeaturedProjects, getProjects } from "@/lib/data"
import { ExternalLink } from "lucide-react"
import { ScrollReveal } from "@/components/layout/scroll-reveal"
import { parseTags } from "@/lib/utils"

export async function PortfolioSection() {
  const featured = await getFeaturedProjects()
  const projects = featured.length > 0 ? featured : await getProjects()

  if (projects.length === 0) return null

  return (
    <section id="portfolio" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Portfolio
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A selection of recent projects.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {projects.map((project, i) => {
            const tags = parseTags(project.techStack)
            return (
              <ScrollReveal key={project.id} delay={i * 100}>
              <div className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
                {project.imageUrl && (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      {project.clientName && (
                        <p className="text-sm text-muted-foreground">
                          {project.clientName}
                        </p>
                      )}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${project.title}`}
                        className="flex size-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {project.description}
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
                  {project.testimonial && (
                    <blockquote className="mt-4 border-l-2 border-primary/30 pl-4 text-sm text-muted-foreground italic">
                      &ldquo;{project.testimonial}&rdquo;
                    </blockquote>
                  )}
                </div>
              </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
