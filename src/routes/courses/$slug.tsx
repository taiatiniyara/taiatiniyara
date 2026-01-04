import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { Course } from "@/lib/drizzle/schema";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DetailPageLayout } from "@/components/ui/detail-page-layout";
import { Heading } from "@/components/ui/heading";

export const Route = createFileRoute("/courses/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = useParams({ from: "/courses/$slug" });

  const { data, isLoading, error } = useSupabaseQuery<Course>({
    queryKey: [`courses/${slug}`],
    tableName: "courses",
    params: { name: "slug", value: slug },
  });
  const course = data?.[0];
  
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
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <div className="bg-card border rounded-lg p-4 sm:p-6 md:p-8 shadow-md">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <Heading level={1} className="mb-4 sm:mb-6">{course.title}</Heading>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{course.description}</p>
          </div>
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
