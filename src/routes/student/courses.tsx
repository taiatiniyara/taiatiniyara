import { createFileRoute } from "@tanstack/react-router";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useAuth } from "@/context/auth-context";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import type { Enrollment, Course } from "@/lib/drizzle/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBox from "@/components/ui/error";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import { ContentCard } from "@/components/ui/content-card";
import { Heading } from "@/components/ui/heading";

export const Route = createFileRoute("/student/courses")({
  component: RouteComponent,
});

function CourseCard({ course, enrollment }: { course: Course; enrollment: Enrollment }) {
  const { progressPercentage, completedLessons, totalLessons } = useCourseProgress({ 
    courseId: course.id 
  });

  return (
    <ContentCard
      title={course.title}
      imageUrl={course.img_url || ""}
      imageAlt={course.title}
      href={`/courses/${course.slug}`}
    >
      <p className="text-sm sm:text-base line-clamp-3 text-muted-foreground mb-4">
        {course.description}
      </p>
      
      {enrollment?.enrolled_at && (
        <p className="text-xs text-muted-foreground mb-4">
          Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
        </p>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            {completedLessons}/{totalLessons} lessons • {progressPercentage}%
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="text-primary font-medium flex items-center gap-1 group">
        Continue Learning
        <svg
          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </ContentCard>
  );
}

function RouteComponent() {
  const { user } = useAuth();

  // Fetch user's enrollments
  const { data: enrollments, isLoading: enrollmentsLoading, error: enrollmentsError } = useSupabaseQuery<Enrollment>({
    queryKey: ["my-enrollments", user?.id || "anonymous"],
    tableName: "enrollments",
    enabled: !!user?.id,
  });

  // Filter enrollments for current user
  const myEnrollments = enrollments?.filter(e => e.user_id === user?.id);
  const courseIds = myEnrollments?.map(e => e.course_id) || [];

  // Fetch courses (we'll need to filter by course IDs)
  const { data: allCourses, isLoading: coursesLoading, error: coursesError } = useSupabaseQuery<Course>({
    queryKey: ["courses"],
    tableName: "courses",
    fields: ["id", "title", "img_url", "description", "slug"],
    enabled: courseIds.length > 0,
  });

  // Filter courses to only show enrolled ones
  const myCourses = allCourses?.filter(course => courseIds.includes(course.id));

  const isLoading = enrollmentsLoading || coursesLoading;
  const error = enrollmentsError || coursesError;

  if (isLoading) {
    return <LoadingSpinner text="Loading your courses..." />;
  }

  if (error) {
    return <ErrorBox message={error.message} />;
  }

  if (!myCourses || myCourses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Heading level={1} className="mb-8">My Courses</Heading>
        <EmptyListPlaceholder text="You haven't enrolled in any courses yet." />
        <div className="flex justify-center mt-6">
          <a 
            href="/courses" 
            className="text-primary hover:underline font-medium"
          >
            Browse Available Courses →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Heading level={1} className="mb-2">My Courses</Heading>
        <p className="text-muted-foreground">
          You're enrolled in {myCourses.length} {myCourses.length === 1 ? 'course' : 'courses'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCourses.map((course) => {
          const enrollment = myEnrollments?.find(e => e.course_id === course.id);
          
          return enrollment ? (
            <CourseCard key={course.id} course={course} enrollment={enrollment} />
          ) : null;
        })}
      </div>
    </div>
  );
}
