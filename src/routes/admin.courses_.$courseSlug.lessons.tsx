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
import { Breadcrumb, createBreadcrumbs } from "@/components/ui/breadcrumb";
import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/courses_/$courseSlug/lessons")({
  component: RouteComponent,
});

// Sortable lesson card component
function SortableLessonCard({
  lesson,
  index,
  courseSlug,
  onEdit,
}: {
  lesson: Lesson;
  index: number;
  courseSlug: string;
  onEdit: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <button
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing touch-none"
            {...attributes}
            {...listeners}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
              <h3 className="text-lg font-semibold">{lesson.title}</h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
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
            onClick={() => onEdit(lesson.id)}
          >
            Edit
          </Button>
          <Button variant="outline" size="sm" asChild>
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
  );
}

function RouteComponent() {
  const { courseSlug } = useParams({ from: "/admin/courses_/$courseSlug/lessons" });
  const [showCreateForm, setShowCreateForm] = React.useState<boolean>(false);
  const [editingLessonId, setEditingLessonId] = React.useState<string | null>(null);
  const [localLessons, setLocalLessons] = React.useState<Lesson[]>([]);
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    fields: ["id", "title", "slug", "duration_minutes", "created_at", "order"],
    orderBy: { column: "order", ascending: true },
    enabled: !!course?.id,
  });

  // Update local lessons when data changes
  React.useEffect(() => {
    if (lessons) {
      setLocalLessons(lessons);
    }
  }, [lessons]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = localLessons.findIndex((lesson) => lesson.id === active.id);
    const newIndex = localLessons.findIndex((lesson) => lesson.id === over.id);

    const newLessons = arrayMove(localLessons, oldIndex, newIndex);
    setLocalLessons(newLessons);

    // Update order in database
    try {
      const updates = newLessons.map((lesson, index) => ({
        id: lesson.id,
        order: index + 1,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("lessons")
          .update({ order: update.order })
          .eq("id", update.id);

        if (error) throw error;
      }

      // Invalidate the query to refetch fresh data
      queryClient.invalidateQueries({ 
        queryKey: [`admin-course-lessons/${course?.id || "none"}`] 
      });

      toast.success("Lesson order updated successfully");
    } catch (error) {
      console.error("Error updating lesson order:", error);
      toast.error("Failed to update lesson order");
      // Revert to original order on error
      if (lessons) {
        setLocalLessons(lessons);
      }
    }
  };

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
      <Breadcrumb
        items={createBreadcrumbs(
          "admin",
          { label: "Lessons" },
          [{ label: "Courses", href: "/admin/courses" }, { label: course.title, href: "#" }]
        )}
        className="mb-4"
        showStructuredData={false}
      />

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={localLessons.map((lesson) => lesson.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-4">
              {localLessons.map((lesson, index) => (
                <SortableLessonCard
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  courseSlug={courseSlug}
                  onEdit={(id) => {
                    setEditingLessonId(id);
                    setShowCreateForm(false);
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="flex justify-center pt-4">
        <Button variant="outline" asChild>
          <Link to="/admin/courses">← Back to Courses</Link>
        </Button>
      </div>
    </div>
  );
}
