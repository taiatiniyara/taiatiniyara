import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { createFileRoute } from "@tanstack/react-router";
import type { Course } from "@/lib/drizzle/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
export const Route = createFileRoute("/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: courses,
    error,
    isLoading,
  } = useSupabaseQuery<Course>({
    queryKey: ["courses"],
    tableName: "courses",
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading courses..." />;
  }
  if (error) {
    return (
      <ErrorBox message="Failed to load courses. Please try again later." />
    );
  }
  if (!courses || courses.length === 0) {
    return <EmptyListPlaceholder text="No courses available." />;
  }

  return (
    <div>
      {courses?.map((course) => (
        <div key={course.id} className="mb-4 p-4 border rounded">
          <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
}
