import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { Lesson, Course } from "@/lib/drizzle/schema";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { DetailPageLayout } from "@/components/ui/detail-page-layout";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { useAuth } from "@/context/auth-context";
import { useCourseAccess } from "@/hooks/useCourseAccess";
import { useLessonAccess } from "@/hooks/useLessonAccess";
import { formatDuration } from "@/lib/utils";
import { toast } from "sonner";
import { EnrollButton } from "@/components/courses/enrollButton";
import { LessonComments } from "@/components/courses/lessonComments";
import { Breadcrumb, createBreadcrumbs } from "@/components/ui/breadcrumb";
import { useEffect } from "react";

export const Route = createFileRoute("/courses/$courseSlug/$lessonSlug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseSlug, lessonSlug } = Route.useParams();
  const { user } = useAuth();

  // Scroll to top when lesson changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [courseSlug, lessonSlug]);

  // Fetch the course
  const { data: courseData, isLoading: courseLoading, error: courseError } = useSupabaseQuery<Course>({
    queryKey: [`courses/${courseSlug}`],
    tableName: "courses",
    params: { name: "slug", value: courseSlug },
  });
  const course = courseData?.[0];

  // Check access: must be admin or enrolled (only check if course exists)
  const { hasAccess, isLoading: checkingAccess, isEnrolled, isAdmin } = useCourseAccess({
    courseId: course?.id || "",
  });

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

  // Check lesson access (previous lesson completion)
  const { 
    canAccessLesson, 
    previousLesson,
    isLoading: checkingLessonAccess 
  } = useLessonAccess({ 
    courseId: course?.id || "", 
    lessonId: lesson?.id || "",
    allLessons 
  });

  // Progress tracking
  const { 
    isCompleted, 
    isMarkingComplete, 
    markAsComplete,
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

  const isLoading = courseLoading || lessonLoading || (checkingAccess && !!course?.id) || checkingLessonAccess;
  const error = courseError || lessonError;

  // Show enrollment screen if user doesn't have access and loading is complete
  if (!isLoading && course && lesson && !hasAccess) {
    if (!user) {
      return <Navigate to="/login" search={{ redirect: `/courses/${courseSlug}/${lessonSlug}` }} />;
    }
    return (
      <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
            <Card className="max-w-2xl mx-auto p-8 text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <Heading level={2} className="mb-4">Enroll to Access This Lesson</Heading>
              <p className="text-muted-foreground mb-6">
                This lesson is only available to enrolled students. Enroll in "{course.title}" to access all lessons and track your progress.
              </p>
              <EnrollButton courseId={course.id} courseTitle={course.title} />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show prerequisite screen if student hasn't completed previous lesson
  if (!isLoading && course && lesson && hasAccess && !isAdmin && !canAccessLesson && previousLesson) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
            <Card className="max-w-2xl mx-auto p-8 text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <Heading level={2} className="mb-4">Complete Previous Lesson First</Heading>
              <p className="text-muted-foreground mb-6">
                You need to complete "{previousLesson.title}" before accessing this lesson.
              </p>
              <Button size="lg" asChild>
                <Link 
                  to="/courses/$courseSlug/$lessonSlug" 
                  params={{ courseSlug, lessonSlug: previousLesson.slug }}
                >
                  Go to Previous Lesson
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Find current lesson index for navigation
  const currentIndex = allLessons?.findIndex(l => l.slug === lessonSlug) ?? -1;
  const prevLesson = currentIndex > 0 ? allLessons?.[currentIndex - 1] : null;
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
              <Breadcrumb
                items={createBreadcrumbs(
                  "courses",
                  { label: lesson.title },
                  [{ label: course.title, href: `/courses/${courseSlug}` }]
                )}
                className="mb-4 pb-4 border-b"
              />

              {/* Lesson Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <Heading level={1} className="mb-4 leading-tight">{lesson.title}</Heading>
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatDuration(lesson.duration_minutes)}</span>
                    </div>
                    {allLessons && (
                      <span>Lesson {currentIndex + 1} of {allLessons.length}</span>
                    )}
                  </div>
                </div>
                
                {/* Progress tracking button */}
                {user && (isEnrolled || isAdmin) && (
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

              {/* Progress tracking button at bottom */}
              <div className="flex justify-center mt-8 pt-8 border-t">
                {user && (isEnrolled || isAdmin) && (
                  <Button 
                    variant={isCompleted ? "secondary" : "default"}
                    onClick={handleMarkComplete}
                    disabled={isCompleted || isMarkingComplete}
                    size="lg"
                  >
                    {isCompleted ? "✓ Completed" : isMarkingComplete ? "Marking..." : "Mark Complete"}
                  </Button>
                )}
                {!user && (
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/login">Sign in to track progress</Link>
                  </Button>
                )}
              </div>

              {/* Breadcrumb at bottom */}
              <Breadcrumb
                items={createBreadcrumbs(
                  "courses",
                  { label: lesson.title },
                  [{ label: course.title, href: `/courses/${courseSlug}` }]
                )}
                className="mt-8 pt-8 border-t"
                showStructuredData={false}
              />
            </div>
          </Card>

          {/* Lesson Navigation */}
          <div className="flex items-center justify-between gap-4">
            {prevLesson ? (
              <Button variant="outline" asChild>
                <Link 
                  to="/courses/$courseSlug/$lessonSlug" 
                  params={{ courseSlug, lessonSlug: prevLesson.slug }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous: {prevLesson.title}
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
                        {formatDuration(l.duration_minutes)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Comments Section */}
          {lesson && <LessonComments lessonId={lesson.id} />}
        </div>
      )}
    </DetailPageLayout>
  );
}
