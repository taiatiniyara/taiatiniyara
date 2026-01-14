import { createFileRoute } from "@tanstack/react-router";
import type { Course, CourseCategory } from "@/lib/drizzle/schema";
import { ContentListPage } from "@/components/ui/content-list-page";
import { ContentCard } from "@/components/ui/content-card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/courses/")({
  component: RouteComponent,
});

type CourseWithCategory = Course & { 
  course_categories: Pick<CourseCategory, "level"> 
};

function RouteComponent() {
  const {
    data: courses,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["courses-with-level"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, img_url, description, slug, course_categories(level)")
        .returns<CourseWithCategory[]>();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <ContentListPage
      title={
        <>
          <span className="text-primary">Courses</span> & Learning
        </>
      }
      description="Explore our curated collection of courses to enhance your skills"
      data={courses}
      isLoading={isLoading}
      error={error}
      emptyText="No courses available."
      loadingText="Loading courses..."
      getItemKey={(course) => course.id}
      renderItem={(course) => (
        <ContentCard
          title={course.title}
          imageUrl={course.img_url || ""}
          imageAlt={course.title}
          href={`/courses/${course.slug}`}
        >
          {course.course_categories?.level && (
            <Badge variant="secondary" className="mb-3 w-fit">
              {course.course_categories.level}
            </Badge>
          )}
          <p className="text-sm sm:text-base line-clamp-4 text-muted-foreground mb-4">
            {course.description}
          </p>
          <div className="text-primary font-medium flex items-center gap-1 group">
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
          </div>
        </ContentCard>
      )}
    />
  );
}
