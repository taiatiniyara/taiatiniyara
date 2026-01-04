import { createFileRoute, useParams } from "@tanstack/react-router";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { Project } from "@/lib/drizzle/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSEO } from "@/hooks/useSEO";
import { useStructuredData } from "@/hooks/useStructuredData";
import { DetailPageLayout } from "@/components/ui/detail-page-layout";
import { Heading } from "@/components/ui/heading";

export const Route = createFileRoute("/projects/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = useParams({ from: "/projects/$slug" });

  const { data, isLoading, error } = useSupabaseQuery<Project>({
    queryKey: [`projects/${slug}`],
    tableName: "projects",
    params: { name: "slug", value: slug },
  });

  const project = data?.[0];

  // SEO optimization - must be called at top level before conditional returns
  useSEO({
    title: project?.title,
    description:
      project?.description ||
      (project
        ? `${project.title} - A software project by Taia Tiniyara`
        : undefined),
    keywords: project
      ? `project, ${project.title}, ${project.technologies?.join(", ") || ""}, software development`
      : undefined,
    canonicalUrl: `/projects/${slug}`,
    ogType: "article",
    ogImage: project?.img_url || undefined,
  });

  // Add structured data for CreativeWork
  useStructuredData(
    project
      ? {
          "@type": "CreativeWork",
          name: project.title,
          description: project.description || project.title,
          image: project.img_url || "https://taiatiniyara.com/og-image.jpg",
          author: {
            "@type": "Person",
            name: "Taia Tiniyara",
            url: "https://taiatiniyara.com/about",
          },
          url: `https://taiatiniyara.com/projects/${slug}`,
          keywords:
            project.tags?.join(", ") || project.technologies?.join(", ") || "",
        }
      : null,
    "project-structured-data"
  );

  return (
    <DetailPageLayout
      isLoading={isLoading}
      error={error}
      data={data}
      loadingText="Loading project..."
      errorMessage="Failed to load project. Please try again later."
      emptyMessage="Project not found."
    >
      {project && (
        <>
          <Card className="overflow-hidden shadow-xl">
            {project.img_url && (
              <div className="relative overflow-hidden">
                <img
                  src={project.img_url}
                  alt={project.title}
                  className="w-full h-48 sm:h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              </div>
            )}
            <div className="p-4 sm:p-6 md:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                {project.title}
              </h1>

              {/* Tags Section */}
              {project.tags && project.tags.length > 0 && (
                <div className="mb-6">
                  <Heading variant="label" className="mb-3">
                    Tags
                  </Heading>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              {/* Description Section */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Description
                </h2>
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                  <p className="text-base sm:text-lg text-foreground leading-relaxed">
                    {project.description || "Project details coming soon."}
                  </p>
                </div>
              </div>

              {/* Technologies Section */}
              {project.technologies && project.technologies.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Technologies Used
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="px-3 py-1"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Project Links Section */}
              {(project.repo_url || project.live_url) && (
                <>
                  <Separator className="my-6" />
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Project Links
                    </h2>
                    <div className="flex flex-wrap gap-4">
                      {project.repo_url && (
                        <Button asChild variant="outline">
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                clipRule="evenodd"
                              />
                            </svg>
                            View Repository
                          </a>
                        </Button>
                      )}
                      {project.live_url && (
                        <Button asChild>
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            View Live
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
          <div className="flex justify-center">
            <Button asChild size="lg" variant="outline">
              <a href="/projects">← Back to Projects</a>
            </Button>
          </div>
        </>
      )}
    </DetailPageLayout>
  );
}
