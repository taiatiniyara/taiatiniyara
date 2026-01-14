import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { Project } from "@/lib/drizzle/schema";
import { createFileRoute } from "@tanstack/react-router";
import { useSEO } from "@/hooks/useSEO";
import { ContentListPage } from "@/components/ui/content-list-page";
import { ContentCard } from "@/components/ui/content-card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  useSEO({
    title: "Projects - Portfolio of Software Development Work",
    description:
      "Explore my portfolio of software development projects including web applications, mobile apps, and custom solutions. See examples of quality software engineering work from Fiji and the Pacific.",
    keywords:
      "software projects Fiji, web development portfolio, developer portfolio Pacific, programming projects, software engineering examples",
    canonicalUrl: "/projects",
    ogType: "website",
  });
  
  const { error, data, isLoading } = useSupabaseQuery<Project>({
    tableName: "projects",
    fields: ["slug", "title", "img_url", "technologies", "ongoing"],
    queryKey: ["all-projects"],
  });

  return (
    <ContentListPage
      title={<>My <span className="text-primary">Projects</span></>}
      description="A showcase of software solutions and creative work"
      data={data}
      isLoading={isLoading}
      error={error}
      emptyText="No projects found."
      loadingText="Loading projects..."
      getItemKey={(project) => project.slug}
      renderItem={(project) => (
        <ContentCard
          title={project.title}
          imageUrl={project.img_url}
          imageAlt={project.title}
          href={`/projects/${project.slug}`}
        >
          <div className="flex flex-wrap gap-2 items-center">
            {project.ongoing && (
              <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                🚧 Ongoing
              </Badge>
            )}
            {Array.isArray(project.technologies) && project.technologies.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </ContentCard>
      )}
    />
  );
}
