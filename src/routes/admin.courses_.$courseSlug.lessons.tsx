import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { type Course, type Lesson } from "@/lib/drizzle/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBox from "@/components/ui/error";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/components/ui/admin-header";
import { FormWrapper } from "@/components/ui/form-wrapper";
import { formatDuration } from "@/lib/utils";
import CreateLessonForm from "@/components/courses/createLesson";
import EditLessonForm from "@/components/courses/editLesson";
import React from "react";

export const Route = createFileRoute("/admin/courses_/$courseSlug/lessons")({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseSlug } = useParams({ from: "/admin/courses_/$courseSlug/lessons" });
  const [showCreateForm, setShowCreateForm] = React.useState<boolean>(false);
  const [editingLessonId, setEditingLessonId] = React.useState<string | null>(null);

  // Fetch the course
  const { data: courseData, isLoading: courseLoading, error: courseError } = useSupabaseQuery<Course>({
    queryKey: [`courses/${courseSlug}`],
    tableName: "courses",
    params: { name: "slug", value: courseSlug },
    fields: ["id", "title", "slug"],
  });
  const course = courseData?.[0];

  // Fetch lessons
  const { data: lessons, error: lessonsError, isLoading: lessonsLoading } = useSupabaseQuery<Lesson>({
    queryKey: [`admin-course-lessons/${course?.id || "none"}`],
    tableName: "lessons",
    params: { name: "course_id", value: course?.id || "" },
    fields: ["id", "title", "slug", "duration_minutes", "created_at"],
    orderBy: { column: "order", ascending: true },
    enabled: !!course?.id,
  });

  if (courseLoading || lessonsLoading) {
    return <LoadingSpinner text="Loading lessons..." />;
  }

  if (courseError || lessonsError) {
    return <ErrorBox message={(courseError || lessonsError)?.message || "An error occurred"} />;
  }

  if (!course) {
    return <EmptyListPlaceholder text="Course not found." />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link to="/admin/courses" className="hover:text-primary transition-colors">
          Courses
        </Link>
        <span>/</span>
        <span className="text-foreground">{course.title}</span>
        <span>/</span>
        <span className="text-foreground">Lessons</span>
      </nav>

      <AdminHeader
        title={`Lessons for "${course.title}"`}
        description="Manage course lessons"
        buttonText="Create Lesson"
        showForm={showCreateForm}
        onToggleForm={() => {
          setShowCreateForm(!showCreateForm);
          setEditingLessonId(null);
        }}
      />

      {showCreateForm && (
        <FormWrapper>
          <CreateLessonForm courseId={course.id} />
        </FormWrapper>
      )}

      {editingLessonId && (
        <FormWrapper title="Edit Lesson" onCancel={() => setEditingLessonId(null)}>
          <EditLessonForm lessonId={editingLessonId} />
        </FormWrapper>
      )}

      {lessons && lessons.length === 0 ? (
        <EmptyListPlaceholder text="No lessons found. Create your first lesson!" />
      ) : (
        <div className="grid gap-4">
          {lessons?.map((lesson, index) => (
            <Card
              key={lesson.id}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-semibold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{lesson.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatDuration(lesson.duration_minutes)}</span>
                      </div>
                      <span>Slug: {lesson.slug}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingLessonId(lesson.id);
                      setShowCreateForm(false);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link
                      to="/courses/$courseSlug/$lessonSlug"
                      params={{ courseSlug, lessonSlug: lesson.slug }}
                      target="_blank"
                    >
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center pt-4">
        <Button variant="outline" asChild>
          <Link to="/admin/courses">← Back to Courses</Link>
        </Button>
      </div>
    </div>
  );
}
