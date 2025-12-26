import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { Project } from "@/lib/drizzle/schema";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { error, data, isLoading } = useSupabaseQuery<Project>({
    tableName: "projects",
    fields: ["slug", "title", "tags", "img_url"],
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
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center">Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.map((project) => (
          <div
            key={project.slug}
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {project.img_url && (
              <img
                src={project.img_url}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
