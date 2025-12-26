import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";
import { SEO } from "@/components/SEO";
import { BookOpen, Award, LogOut, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  const { user, isAuthenticated, logout } = useUser();

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

  // Get enrolled courses from localStorage
  const enrolledCourseIds = JSON.parse(
    localStorage.getItem("enrolled_courses") || "[]"
  );

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
                    {enrolledCourseIds.length}
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
                    {
                      enrolledCourseIds.filter((id: string) => {
                        const progress = localStorage.getItem(
                          `progress_${id}_${user?.email}`
                        );
                        return progress === "100";
                      }).length
                    }
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
                    {
                      enrolledCourseIds.filter((id: string) => {
                        const progress = localStorage.getItem(
                          `progress_${id}_${user?.email}`
                        );
                        return progress !== "100" && progress !== "0";
                      }).length
                    }
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

            {enrolledCourseIds.length === 0 ? (
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
                {enrolledCourseIds.map((courseId: string) => (
                  <EnrolledCourseCard
                    key={courseId}
                    courseId={courseId}
                    userEmail={user?.email || ""}
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
  courseId,
  userEmail,
}: {
  courseId: string;
  userEmail: string;
}) {
  // Fetch course details
  const { data: courses } = { data: [] as any[] }; // Placeholder - implement proper data fetching
  
  // This should be replaced with proper data fetching
  // const { data: courses } = useQuery({
  //   queryKey: ["allCourses"],
  //   queryFn: async () => {
  //     const { getAllCourses } = await import("@/lib/course");
  //     const response = await getAllCourses();
  //     return response;
  //   },
  // });

  const course = courses?.find((c: any) => c.id === courseId);
  const progress = parseInt(
    localStorage.getItem(`progress_${courseId}_${userEmail}`) || "0"
  );
  const completedModulesData = localStorage.getItem(
    `completed_modules_${courseId}_${userEmail}`
  );
  const completedModules = completedModulesData
    ? JSON.parse(completedModulesData).length
    : 0;

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
            {completedModules} modules completed
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
