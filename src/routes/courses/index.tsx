import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { createFileRoute } from "@tanstack/react-router";
import type { Course } from "@/lib/drizzle/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
export const Route = createFileRoute("/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: courses,
    error,
    isLoading,
  } = useSupabaseQuery<Course>({
    queryKey: ["courses"],
    tableName: "courses",
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading courses..." />;
  }
  if (error) {
    return (
      <ErrorBox message="Failed to load courses. Please try again later." />
    );
  }
  if (!courses || courses.length === 0) {
    return <EmptyListPlaceholder text="No courses available." />;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-chart-3/10 border-b">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
              <span className="text-primary">Courses</span> & Learning
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of courses to enhance your skills
            </p>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {courses?.map((course) => (
            <div
              key={course.id}
              className="bg-card border rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <img
                src={course.img_url || ""}
                className="w-full"
                alt={course.title}
              />

              <div className="p-4">
                <h2 className="text-xl sm:text-2xl font-bold mb-3">
                  {course.title}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  {course.description}
                </p>
                <a
                  href={`/courses/${course.slug}`}
                  className="text-primary font-medium hover:underline flex items-center gap-1 group"
                >
                  Learn more
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
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
