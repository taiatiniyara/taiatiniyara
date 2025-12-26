import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";
import { SEO } from "@/components/SEO";
import { BookOpen, Award, LogOut, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserEnrollments, getCompletedModules } from "@/lib/course";
import type { Course } from "@/types/course";

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  const { user, isAuthenticated, logout } = useUser();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(true);

  // Load enrollments from Supabase
  useEffect(() => {
    const loadEnrollments = async () => {
      if (user?.id) {
        try {
          const data = await getUserEnrollments(user.id);
          setEnrollments(data);
        } catch (err) {
          console.error('Error loading enrollments:', err);
        } finally {
          setIsLoadingEnrollments(false);
        }
      } else {
        setIsLoadingEnrollments(false);
      }
    };
    
    loadEnrollments();
  }, [user?.id]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Login Required</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Please log in to view your dashboard.
          </p>
          <Link to="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const completedCount = enrollments.filter(e => e.progress === 100).length;
  const inProgressCount = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;

  return (
    <>
      <SEO
        title="My Learning Dashboard"
        description="Track your course progress and continue learning"
      />
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Welcome back, {user?.name || user?.email}!
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Continue your learning journey
              </p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Enrolled Courses
                  </p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    {enrollments.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Completed
                  </p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    {completedCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    In Progress
                  </p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    {inProgressCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Enrolled Courses */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              My Courses
            </h2>

            {isLoadingEnrollments ? (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">Loading your courses...</p>
              </div>
            ) : enrollments.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  No courses yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Start learning by enrolling in a course
                </p>
                <Link to="/courses">
                  <Button>Browse Courses</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => (
                  <EnrolledCourseCard
                    key={enrollment.id}
                    enrollment={enrollment}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function EnrolledCourseCard({
  enrollment,
}: {
  enrollment: any;
}) {
  const { user } = useUser();
  // Fetch course details
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completedModulesCount, setCompletedModulesCount] = useState(0);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        // Get course by ID - we need to fetch all courses and find by ID
        // or better, update getCourseBySlug to also support ID lookup
        const { supabase } = await import('@/lib/supabase');
        const { data: courseData } = await supabase
          .from('courses')
          .select('*')
          .eq('id', enrollment.course_id)
          .single();
        
        if (courseData) {
          setCourse(courseData as Course);
          
          // Get completed modules count
          if (user?.id) {
            const completedIds = await getCompletedModules(enrollment.course_id, user.id);
            setCompletedModulesCount(completedIds.length);
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourseData();
  }, [enrollment.course_id, user?.id]);

  const progress = enrollment.progress || 0;

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="h-40 bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="p-6">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
      </Card>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {course.thumbnail && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          {progress === 100 && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-600 text-white border-0">
                <Award className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600 dark:text-slate-400">
              Progress
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {progress}%
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {completedModulesCount} modules completed
          </p>
        </div>

        <Link
          to="/courses/$slug"
          params={{
            slug: course.slug,
          }}
        >
          <Button className="w-full">
            {progress === 100 ? "Review Course" : "Continue Learning"}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
