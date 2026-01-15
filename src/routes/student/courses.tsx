import { createFileRoute } from "@tanstack/react-router";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useAuth } from "@/context/auth-context";
import type { Enrollment, Course, Lesson, ProgressTracking } from "@/lib/drizzle/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBox from "@/components/ui/error";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import { ContentCard } from "@/components/ui/content-card";
import { Heading } from "@/components/ui/heading";
import { useState } from "react";

export const Route = createFileRoute("/student/courses")({
  component: RouteComponent,
});

function CourseCardWithProgress({ 
  course, 
  enrollment,
  progressPercentage,
  completedLessons,
  totalLessons,
}: { 
  course: Course; 
  enrollment: Enrollment;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
}) {
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
  const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'name'>('recent');
  const [filterBy, setFilterBy] = useState<'all' | 'in-progress' | 'completed' | 'not-started'>('all');

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

  // Fetch all lessons for enrolled courses
  const { data: allLessons } = useSupabaseQuery<Lesson>({
    queryKey: ["enrolled-course-lessons-list", user?.id || "anonymous"],
    tableName: "lessons",
    enabled: courseIds.length > 0,
  });

  // Fetch all progress tracking
  const { data: allProgress } = useSupabaseQuery<ProgressTracking>({
    queryKey: ["user-progress-list", user?.id || "anonymous"],
    tableName: "progress_tracking",
    enabled: myEnrollments && myEnrollments.length > 0,
  });

  // Filter courses to only show enrolled ones
  let myCourses = allCourses?.filter(course => courseIds.includes(course.id)) || [];

  const isLoading = enrollmentsLoading || coursesLoading;
  const error = enrollmentsError || coursesError;

  // Calculate progress for all courses at once
  const coursesWithProgress = myCourses.map(course => {
    const enrollment = myEnrollments?.find(e => e.course_id === course.id);
    const courseLessons = allLessons?.filter(l => l.course_id === course.id) || [];
    const courseProgress = allProgress?.filter(p => p.enrollment_id === enrollment?.id) || [];
    const completed = courseProgress.filter(p => p.is_completed).length;
    const total = courseLessons.length;
    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { 
      course, 
      enrollment,
      progressPercentage,
      completedLessons: completed,
      totalLessons: total,
    };
  });

  // Filter courses
  let filteredCourses = coursesWithProgress;
  if (filterBy !== 'all') {
    filteredCourses = coursesWithProgress.filter(({ progressPercentage }) => {
      if (filterBy === 'completed') return progressPercentage === 100;
      if (filterBy === 'in-progress') return progressPercentage > 0 && progressPercentage < 100;
      if (filterBy === 'not-started') return progressPercentage === 0;
      return true;
    });
  }

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'name') {
      return a.course.title.localeCompare(b.course.title);
    }
    if (sortBy === 'progress') {
      return b.progressPercentage - a.progressPercentage;
    }
    // Sort by recent (enrollment date)
    if (sortBy === 'recent') {
      const dateA = a.enrollment?.enrolled_at ? new Date(a.enrollment.enrolled_at).getTime() : 0;
      const dateB = b.enrollment?.enrolled_at ? new Date(b.enrollment.enrolled_at).getTime() : 0;
      return dateB - dateA;
    }
    return 0;
  });

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
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Browse Available Courses
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Heading level={1} className="mb-2">My Courses</Heading>
            <p className="text-muted-foreground">
              {filteredCourses.length === myCourses.length 
                ? `You're enrolled in ${myCourses.length} ${myCourses.length === 1 ? 'course' : 'courses'}`
                : `Showing ${filteredCourses.length} of ${myCourses.length} ${myCourses.length === 1 ? 'course' : 'courses'}`
              }
            </p>
          </div>
          <a 
            href="/courses" 
            className="hidden sm:flex items-center gap-2 text-primary hover:underline font-medium"
          >
            Browse More Courses
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="text-sm font-medium text-muted-foreground">
              Filter:
            </label>
            <select
              id="filter"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
              className="px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Courses</option>
              <option value="in-progress">In Progress</option>
              <option value="not-started">Not Started</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-muted-foreground">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="recent">Recently Enrolled</option>
              <option value="progress">Progress</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No courses match your current filter.</p>
          <button
            onClick={() => setFilterBy('all')}
            className="text-primary hover:underline font-medium"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCourses.map(({ course, enrollment, progressPercentage, completedLessons, totalLessons }) => 
            enrollment ? (
              <CourseCardWithProgress 
                key={course.id} 
                course={course} 
                enrollment={enrollment}
                progressPercentage={progressPercentage}
                completedLessons={completedLessons}
                totalLessons={totalLessons}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
