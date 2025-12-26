import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { createFileRoute } from "@tanstack/react-router";
import type { Course } from "@/lib/drizzle/schema";
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
    return <div>Loading Courses...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!courses || courses.length === 0) {
    return <div className="text-center p-12">No courses found.</div>;
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
