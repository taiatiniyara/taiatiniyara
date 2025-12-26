import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { Course } from "@/lib/drizzle/schema";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = useParams({ from: "/courses/$slug" });

  const { data, isLoading, error } = useSupabaseQuery<Course>({
    queryKey: [`courses/${slug}`],
    tableName: "courses",
    params: { name: "slug", value: slug },
  });
  if (isLoading) {
    return <LoadingSpinner text={`Loading course...`} />;
  }

  if (error) {
    return (
      <ErrorBox message="Failed to load course. Please try again later." />
    );
  }

  if (!data || data.length === 0) {
    return <EmptyListPlaceholder text="Course not found." />;
  }

  const course = data[0];
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
      <p className="mb-6">{course.description}</p>
    </div>
  );
}
