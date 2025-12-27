import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { Project } from "@/lib/drizzle/schema";
import { createFileRoute } from "@tanstack/react-router";
import { useSEO } from "@/hooks/useSEO";

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  useSEO({
    title: "Projects - Portfolio of Software Development Work",
    description: "Explore my portfolio of software development projects including web applications, mobile apps, and custom solutions. See examples of quality software engineering work from Fiji and the Pacific.",
    keywords: "software projects Fiji, web development portfolio, developer portfolio Pacific, programming projects, software engineering examples",
    canonicalUrl: "/projects",
    ogType: "website",
  });
  const { error, data, isLoading } = useSupabaseQuery<Project>({
    tableName: "projects",
    fields: ["slug", "title", "img_url"],
    queryKey: ["all-projects"],
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading projects..." />
  }

  if (error) {
    return <ErrorBox message={error.message} />;
  }

  if (!data || data.length === 0) {
    return <EmptyListPlaceholder text="No projects found." />;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-chart-3/10 border-b">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
              My <span className="text-primary">Projects</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A showcase of software solutions and creative work
            </p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {data?.map((project) => (
            <a
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <div className="bg-card border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
                {project.img_url && (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={project.img_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                  </div>
                )}
                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {project.title}
                  </h2>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
