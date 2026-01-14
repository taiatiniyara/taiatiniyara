import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { Course, Lesson, ProgressTracking } from "@/lib/drizzle/schema";
import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DetailPageLayout } from "@/components/ui/detail-page-layout";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnrollButton } from "@/components/courses/enrollButton";
import { useEnrollmentData } from "@/hooks/useEnrollmentData";
import { useAuth } from "@/context/auth-context";
import { formatDuration } from "@/lib/utils";

export const Route = createFileRoute("/courses/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = useParams({ from: "/courses/$slug" });
  const { user } = useAuth();

  const { data, isLoading, error } = useSupabaseQuery<Course>({
    queryKey: [`courses/${slug}`],
    tableName: "courses",
    params: { name: "slug", value: slug },
  });
  const course = data?.[0];

  // Fetch lessons for this course
  const { data: lessons, isLoading: lessonsLoading } = useSupabaseQuery<Lesson>({
    queryKey: [`course-lessons/${course?.id}`],
    tableName: "lessons",
    params: { name: "course_id", value: course?.id || "" },
    fields: ["id", "slug", "title", "duration_minutes"],
    enabled: !!course?.id,
  });

  // Get enrollment data for the current user
  const { enrollment } = useEnrollmentData(course?.id || "");

  // Get progress tracking for this enrollment
  const { data: progressData } = useSupabaseQuery<ProgressTracking>({
    queryKey: [`course-progress-${course?.id}`, enrollment?.id || "no-enrollment"],
    tableName: "progress_tracking",
    enabled: !!enrollment?.id && !!user?.id,
  });

  // Create a Set of completed lesson IDs for quick lookup
  const completedLessonIds = new Set(
    progressData
      ?.filter(p => p.enrollment_id === enrollment?.id && p.is_completed)
      .map(p => p.lesson_id) || []
  );

  const totalDuration = lessons?.reduce((acc, lesson) => acc + lesson.duration_minutes, 0) || 0;
  
  return (
    <DetailPageLayout
      isLoading={isLoading}
      error={error}
      data={data}
      loadingText="Loading course..."
      errorMessage="Failed to load course. Please try again later."
      emptyMessage="Course not found."
    >
      {course && (
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          {/* Course Header */}
          <div className="bg-card border rounded-lg p-4 sm:p-6 md:p-8 shadow-md">
            {course.img_url && (
              <img 
                src={course.img_url} 
                alt={course.title}
                className="w-full h-48 sm:h-64 object-cover rounded-lg mb-6"
              />
            )}
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <Heading level={1} className="mb-4 sm:mb-6">{course.title}</Heading>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">{course.description}</p>
            
            {/* Course Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {lessons && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>{lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatDuration(totalDuration)} total</span>
                  </div>
                </>
              )}
            </div>

            {/* Technologies */}
            {course.technologies && course.technologies.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Technologies:</h3>
                <div className="flex flex-wrap gap-2">
                  {course.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">{tech}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enrollment Button */}
          <div className="flex justify-center">
            <EnrollButton courseId={course.id} courseTitle={course.title} />
          </div>

          {/* Lessons List */}
          {lessons && lessons.length > 0 && (
            <Card className="p-6">
              <Heading level={2} className="mb-4">Course Curriculum</Heading>
              <div className="space-y-2">
                {lessons.map((lesson, index) => {
                  const isCompleted = completedLessonIds.has(lesson.id);
                  
                  return (
                    <Link
                      key={lesson.id}
                      to="/courses/$courseSlug/$lessonSlug"
                      params={{ courseSlug: slug, lessonSlug: lesson.slug }}
                      className="block p-4 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isCompleted ? 'bg-green-500/10' : 'bg-primary/10'
                          }`}>
                            {isCompleted ? (
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <h4 className={`font-medium group-hover:text-primary transition-colors ${
                              isCompleted ? 'text-muted-foreground' : ''
                            }`}>
                              {lesson.title}
                              {isCompleted && (
                                <Badge variant="secondary" className="ml-2 text-xs bg-green-500/10 text-green-700 dark:text-green-400">
                                  Completed
                                </Badge>
                              )}
                            </h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{formatDuration(lesson.duration_minutes)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          )}

          {!lessonsLoading && (!lessons || lessons.length === 0) && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No lessons available yet. Check back soon!</p>
            </Card>
          )}

          <div className="flex justify-center">
            <Button asChild size="lg" variant="outline">
              <a href="/courses">← Back to Courses</a>
            </Button>
          </div>
        </div>
      )}
    </DetailPageLayout>
  );
}
