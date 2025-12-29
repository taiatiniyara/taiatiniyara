import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import CreateCourseForm from "@/components/courses/createCouse";
import CreateCourseCategoryForm from "@/components/courses/createCourseCategory";
import { type Course } from "@/lib/drizzle/schema";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EditCourseForm from "@/components/courses/editCourse";

export const Route = createFileRoute("/admin/courses")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, error, isLoading } = useSupabaseQuery<Course>({
    queryKey: ["admin-courses"],
    tableName: "courses",
    fields: ["id", "title", "created_at"],
  });

  const [showCreateForm, setShowCreateForm] = React.useState<boolean>(false);
  const [editingCourseId, setEditingCourseId] = React.useState<string | null>(
    null
  );

  if (isLoading) return <LoadingSpinner text="Loading courses..." />;

  if (error) return <ErrorBox message={error.message} />;

  if (data && data.length === 0)
    return (
      <div className="w-full">
        <EmptyListPlaceholder text="No courses found." />
        <div className="flex gap-4">
          <CreateCourseForm />
          <CreateCourseCategoryForm />
        </div>
      </div>
    );

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">Courses</h2>
          <p className="text-muted-foreground">Manage your courses</p>
        </div>

        <Button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingCourseId(null);
          }}
        >
          {showCreateForm ? (
            "Cancel"
          ) : (
            <>
              <Plus /> Create Course
            </>
          )}
        </Button>
      </div>

      {showCreateForm ?? <CreateCourseForm />}
      {editingCourseId === null ? null : (
        <EditCourseForm courseId={editingCourseId} />
      )}

      <div className="grid grid-cols-2 gap-4 max-h-100 my-4">
        {data?.map((course) => (
          <Card
            key={course.id}
            className="p-6 hover:shadow-md transition-shadow"
          >
            <img src={course.img_url || ""} alt="course-thumbnail" />

            <div>
              <h3>{course.title}</h3>
              <p className="p-3 line-clamp-3">{course.description}</p>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setEditingCourseId(course.id);
              }}
            >
              Edit
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
