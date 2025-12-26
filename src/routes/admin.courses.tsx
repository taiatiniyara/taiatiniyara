import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/courses")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, error, isLoading } = useSupabaseQuery({
    queryKey: ["admin-courses"],
    tableName: "courses",
    fields: ["id", "title", "created_at"],
  });

  if (isLoading) return <LoadingSpinner text="Loading courses..." />;

  if (error) return <ErrorBox message={error.message} />;

  if (data && data.length === 0)
    return <EmptyListPlaceholder text="No courses found." />;

  return <div>Hello "/admin/courses"!</div>;
}
