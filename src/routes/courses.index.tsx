import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePublishedCourses } from "@/hooks/useCourseQueries";
import { GraduationCap, BookOpen, Award } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export const Route = createFileRoute("/courses/")({
  component: CoursesIndex,
});

function CoursesIndex() {
  const { data, isLoading } = usePublishedCourses(1, 100);
  const courses = data?.courses || [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SEO
        title="Developer Courses"
        description="Online software development courses by Taia Tiniyara."
      />
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <GraduationCap className="w-10 h-10" />
              Developer Courses
            </h1>
            <p className="text-slate-600 mt-2">
              Learn software development with comprehensive courses
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/courses/admin">
              <Button variant="outline">Courses Admin</Button>
            </Link>
            <Link to="/courses/modules-admin">
              <Button variant="outline">Modules Admin</Button>
            </Link>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <p className="text-xl">No courses published yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} to="/courses/$slug" params={{ slug: course.slug }}>
                <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    {course.level && (
                      <Badge>{course.level}</Badge>
                    )}
                    {course.featured && (
                      <Badge className="bg-purple-600 text-white">
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge className="bg-green-500 text-white border-0">Free</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{course.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <BookOpen className="w-4 h-4" />
                    <span>Online Course</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
