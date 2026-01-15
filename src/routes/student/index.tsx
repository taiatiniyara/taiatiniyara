import { createFileRoute } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/auth-context'
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { Enrollment, Course, ProgressTracking, Lesson } from "@/lib/drizzle/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";

export const Route = createFileRoute('/student/')({
  component: RouteComponent,
})

function CourseInProgressCardWithProgress({ 
  course, 
  progressPercentage, 
  completedLessons, 
  totalLessons 
}: { 
  course: Course;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
}) {
  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-base mb-1 line-clamp-1">{course.title}</h4>
          <p className="text-xs text-muted-foreground">
            {completedLessons}/{totalLessons} lessons completed
          </p>
        </div>
        {course.img_url && (
          <img 
            src={course.img_url} 
            alt={course.title}
            className="w-12 h-12 rounded object-cover ml-3"
          />
        )}
      </div>
      <div className="mb-3">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{progressPercentage}% complete</p>
      </div>
      <a 
        href={`/courses/${course.slug}`}
        className="text-sm text-primary font-medium hover:underline flex items-center gap-1 group"
      >
        Continue Learning
        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </Card>
  );
}

function RouteComponent() {
  const { user } = useAuth();
  
  // Fetch user's enrollments
  const { data: enrollments, isLoading: enrollmentsLoading } = useSupabaseQuery<Enrollment>({
    queryKey: ["my-enrollments", user?.id || "anonymous"],
    tableName: "enrollments",
    enabled: !!user?.id,
  });

  // Filter enrollments for current user
  const myEnrollments = enrollments?.filter(e => e.user_id === user?.id) || [];
  const courseIds = myEnrollments.map(e => e.course_id);

  // Fetch enrolled courses
  const { data: allCourses, isLoading: coursesLoading } = useSupabaseQuery<Course>({
    queryKey: ["enrolled-courses", user?.id || "anonymous"],
    tableName: "courses",
    enabled: courseIds.length > 0,
  });

  // Fetch all lessons for enrolled courses
  const { data: allLessons } = useSupabaseQuery<Lesson>({
    queryKey: ["enrolled-course-lessons", user?.id || "anonymous"],
    tableName: "lessons",
    enabled: courseIds.length > 0,
  });

  // Fetch all progress tracking for user's enrollments
  const { data: allProgress, isLoading: progressLoading } = useSupabaseQuery<ProgressTracking>({
    queryKey: ["user-progress", user?.id || "anonymous"],
    tableName: "progress_tracking",
    enabled: myEnrollments.length > 0,
  });

  const myCourses = allCourses?.filter(course => courseIds.includes(course.id)) || [];
  
  // Calculate statistics
  const totalEnrolled = myEnrollments.length;
  const enrollmentIds = myEnrollments.map(e => e.id);
  const userProgress = allProgress?.filter(p => enrollmentIds.includes(p.enrollment_id)) || [];
  const completedLessons = userProgress.filter(p => p.is_completed).length;
  
  // Calculate progress for each course
  const coursesWithProgress = myCourses.map(course => {
    const courseLessons = allLessons?.filter(l => l.course_id === course.id) || [];
    const enrollment = myEnrollments.find(e => e.course_id === course.id);
    const courseProgress = userProgress.filter(p => p.enrollment_id === enrollment?.id) || [];
    const completed = courseProgress.filter(p => p.is_completed).length;
    const total = courseLessons.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      course,
      progressPercentage: percentage,
      completedLessons: completed,
      totalLessons: total,
    };
  });
  
  // Find courses in progress (not completed)
  const coursesInProgress = coursesWithProgress
    .filter(({ progressPercentage }) => progressPercentage > 0 && progressPercentage < 100)
    .slice(0, 3); // Show up to 3 courses

  const isLoading = enrollmentsLoading || coursesLoading || progressLoading;

  if (isLoading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }
  
  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Welcome Header */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">
              Welcome back, <span className="text-primary">{user?.user_metadata?.fullName?.split(' ')[0] || 'Student'}</span>!
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Let's continue your learning journey
            </p>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{totalEnrolled}</div>
              <div className="text-sm text-muted-foreground">Enrolled Courses</div>
            </Card>

            <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">{completedLessons}</div>
              <div className="text-sm text-muted-foreground">Lessons Completed</div>
            </Card>

            <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">{coursesInProgress.length}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </Card>
          </div>

          {/* Continue Learning Section */}
          {coursesInProgress.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold">Continue Learning</h2>
                <a 
                  href="/student/courses" 
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coursesInProgress.map(({ course, progressPercentage, completedLessons, totalLessons }) => (
                  <CourseInProgressCardWithProgress 
                    key={course.id} 
                    course={course} 
                    progressPercentage={progressPercentage}
                    completedLessons={completedLessons}
                    totalLessons={totalLessons}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">My Courses</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                    View all {totalEnrolled} enrolled {totalEnrolled === 1 ? 'course' : 'courses'} and track your progress
                  </p>
                  <a href="/student/courses" className="text-primary font-medium hover:underline flex items-center gap-1 group">
                    View All Courses
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Browse Courses</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                    Discover new courses to expand your knowledge
                  </p>
                  <a href="/courses" className="text-primary font-medium hover:underline flex items-center gap-1 group">
                    Explore Courses
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">My Profile</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                    Update your account settings and preferences
                  </p>
                  <a href="/profile" className="text-primary font-medium hover:underline flex items-center gap-1 group">
                    View Profile
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Blog</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                    Read latest articles and tutorials
                  </p>
                  <a href="/blog" className="text-primary font-medium hover:underline flex items-center gap-1 group">
                    Visit Blog
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* No Courses CTA */}
          {totalEnrolled === 0 && (
            <Card className="p-6 sm:p-8 text-center border-2 border-dashed">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Start Your Learning Journey</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't enrolled in any courses yet. Browse our catalog to find courses that interest you.
              </p>
              <a 
                href="/courses"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Browse Courses
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
