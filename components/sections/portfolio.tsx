import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { getFeaturedProjects } from "@/lib/data"
import { ExternalLink, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export async function Portfolio() {
  const projects = await getFeaturedProjects()

  if (projects.length === 0) return null

  return (
    <section id="portfolio" className="bg-muted/30 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Client Success Stories
            </h2>
            <p className="mt-3 text-muted-foreground">
              Real results we&apos;ve delivered for businesses like yours.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ScrollReveal key={project.id}>
              <Card className="overflow-hidden flex flex-col pt-0 hover:border-primary/40 hover:shadow-sm transition-all duration-200">
                {project.imageUrl ? (
                  <div className="relative h-48 bg-muted">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center bg-muted">
                    <Star className="size-8 text-muted-foreground/30" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{project.title}</h3>
                    {project.featured === 1 && (
                      <Star className="size-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground flex-1 line-clamp-3">
                    {project.description}
                  </p>

                  {project.techStack && project.techStack !== "[]" && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {JSON.parse(project.techStack).map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {project.clientName && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Client: {project.clientName}
                    </p>
                  )}

                  {project.link && (
                    <Button variant="ghost" size="sm" className="mt-3 w-full" asChild>
                      <Link href={project.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-3.5 mr-1" />
                        View Project
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
