import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { Lesson, Course } from "@/lib/drizzle/schema";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DetailPageLayout } from "@/components/ui/detail-page-layout";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/courses/$courseSlug/$lessonSlug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseSlug, lessonSlug } = Route.useParams();
  const { user } = useAuth();

  // Fetch the course
  const { data: courseData, isLoading: courseLoading, error: courseError } = useSupabaseQuery<Course>({
    queryKey: [`courses/${courseSlug}`],
    tableName: "courses",
    params: { name: "slug", value: courseSlug },
  });
  const course = courseData?.[0];

  // Fetch the specific lesson
  const { data: lessonData, isLoading: lessonLoading, error: lessonError } = useSupabaseQuery<Lesson>({
    queryKey: [`lessons/${lessonSlug}`],
    tableName: "lessons",
    params: { name: "slug", value: lessonSlug },
  });
  const lesson = lessonData?.[0];

  // Fetch all lessons for this course (for navigation)
  const { data: allLessons } = useSupabaseQuery<Lesson>({
    queryKey: [`course-lessons/${course?.id || "none"}`],
    tableName: "lessons",
    params: { name: "course_id", value: course?.id || "" },
    fields: ["id", "slug", "title", "duration_minutes"],
    enabled: !!course?.id,
  });

  // Progress tracking
  const { 
    isCompleted, 
    isMarkingComplete, 
    markAsComplete,
    hasEnrollment 
  } = useProgressTracking({ 
    courseId: course?.id || "", 
    lessonId: lesson?.id || "" 
  });

  const handleMarkComplete = async () => {
    try {
      await markAsComplete();
      toast.success("Lesson marked as complete!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to mark lesson as complete";
      toast.error(message);
    }
  };

  const isLoading = courseLoading || lessonLoading;
  const error = courseError || lessonError;

  // Find current lesson index for navigation
  const currentIndex = allLessons?.findIndex(l => l.slug === lessonSlug) ?? -1;
  const previousLesson = currentIndex > 0 ? allLessons?.[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < (allLessons?.length || 0) - 1 ? allLessons?.[currentIndex + 1] : null;

  return (
    <DetailPageLayout
      isLoading={isLoading}
      error={error}
      data={lesson ? [lesson] : []}
      loadingText="Loading lesson..."
      errorMessage="Failed to load lesson. Please try again later."
      emptyMessage="Lesson not found."
    >
      {lesson && course && (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Main Lesson Card */}
          <Card className="overflow-hidden shadow-xl">
            <div className="p-4 sm:p-6 md:p-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 pb-4 border-b">
                <Link to="/courses" className="hover:text-primary transition-colors">
                  Courses
                </Link>
                <span>/</span>
                <Link 
                  to="/courses/$slug" 
                  params={{ slug: courseSlug }}
                  className="hover:text-primary transition-colors"
                >
                  {course.title}
                </Link>
                <span>/</span>
                <span className="text-foreground">{lesson.title}</span>
              </nav>

              {/* Lesson Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <Heading level={1} className="mb-4 leading-tight">{lesson.title}</Heading>
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{lesson.duration_minutes} minutes</span>
                    </div>
                    {allLessons && (
                      <span>Lesson {currentIndex + 1} of {allLessons.length}</span>
                    )}
                  </div>
                </div>
                
                {/* Progress tracking button */}
                {user && hasEnrollment && (
                  <Button 
                    variant={isCompleted ? "secondary" : "default"}
                    onClick={handleMarkComplete}
                    disabled={isCompleted || isMarkingComplete}
                  >
                    {isCompleted ? "✓ Completed" : isMarkingComplete ? "Marking..." : "Mark Complete"}
                  </Button>
                )}
                {!user && (
                  <Button variant="outline" asChild>
                    <Link to="/login">Sign in to track progress</Link>
                  </Button>
                )}
              </div>

              <div className="border-t pt-6 mb-6" />

              {/* Lesson Content */}
              <div 
                id="lesson-content"
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />

              {/* Breadcrumb at bottom */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mt-8 pt-8 border-t">
                <Link to="/courses" className="hover:text-primary transition-colors">
                  Courses
                </Link>
                <span>/</span>
                <Link 
                  to="/courses/$slug" 
                  params={{ slug: courseSlug }}
                  className="hover:text-primary transition-colors"
                >
                  {course.title}
                </Link>
                <span>/</span>
                <span className="text-foreground">{lesson.title}</span>
              </nav>
            </div>
          </Card>

          {/* Lesson Navigation */}
          <div className="flex items-center justify-between gap-4">
            {previousLesson ? (
              <Button variant="outline" asChild>
                <Link 
                  to="/courses/$courseSlug/$lessonSlug" 
                  params={{ courseSlug, lessonSlug: previousLesson.slug }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous: {previousLesson.title}
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/courses/$slug" params={{ slug: courseSlug }}>
                  ← Back to Course
                </Link>
              </Button>
            )}

            {nextLesson && (
              <Button asChild>
                <Link 
                  to="/courses/$courseSlug/$lessonSlug" 
                  params={{ courseSlug, lessonSlug: nextLesson.slug }}
                >
                  Next: {nextLesson.title}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </Button>
            )}
          </div>

          {/* All Lessons List */}
          {allLessons && allLessons.length > 0 && (
            <Card className="p-6">
              <Heading level={3} className="mb-4">Course Lessons</Heading>
              <div className="space-y-2">
                {allLessons.map((l, index) => (
                  <Link
                    key={l.id}
                    to="/courses/$courseSlug/$lessonSlug"
                    params={{ courseSlug, lessonSlug: l.slug }}
                    className={`block p-3 rounded-lg transition-colors ${
                      l.slug === lessonSlug 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {index + 1}
                        </span>
                        <span>{l.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {l.duration_minutes} min
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </DetailPageLayout>
  );
}
