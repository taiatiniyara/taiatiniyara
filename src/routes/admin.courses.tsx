import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

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
    return (
      <div className="w-full">
        <EmptyListPlaceholder text="No courses found." />
      </div>
    );

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">Courses</h2>
          <p className="text-muted-foreground">Manage your courses</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {data?.map((course) => (
          <Card key={course.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Created: {new Date(course.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
