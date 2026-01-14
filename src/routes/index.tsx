import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import { Heading } from "@/components/ui/heading";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { type BlogPost, type Course } from "@/lib/drizzle/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBox from "@/components/ui/error";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useSEO({
    title: "Software Engineering & Development in Fiji & the Pacific",
    description:
      "Helping software engineering and development training in Fiji and the Pacific Islands. Expert software engineers, programmers, and developers offering comprehensive courses for Pacific professionals.",
    keywords:
      "software engineer Fiji, programmer Fiji, software developer Fiji, web development Fiji, coding courses Fiji, developer training Pacific",
    canonicalUrl: "/",
    ogType: "website",
  });

  const { isLoading, data, error } = useSupabaseQuery<BlogPost>({
    tableName: "blog_posts",
    queryKey: ["blog_posts", "latest"],
    numberOfItems: 3,
    orderBy: { column: "created_at", ascending: false },
  });

  const { 
    isLoading: coursesLoading, 
    data: courses, 
    error: coursesError 
  } = useSupabaseQuery<Course>({
    tableName: "courses",
    queryKey: ["courses", "featured"],
    numberOfItems: 3,
    fields: ["id", "title", "img_url", "description", "slug"],
  });
  return (
    <div className="relative w-full">
      {/* Hero Section */}
      <div className="relative z-0 min-h-screen flex flex-col items-center justify-center px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
            <span className="text-sm font-medium text-primary">
              Ready to transform your ideas
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <Heading variant="hero">
              <span className="text-primary">Turn Your Vision</span>
            </Heading>
            <Heading
              level={2}
              className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-muted-foreground"
            >
              Into Powerful Software
            </Heading>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Whether you need a web app, mobile solution, or cloud
            infrastructure, get a partner who turns your challenges into
            elegant, scalable software that drives results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a href="/projects">
              <Button
                size="lg"
                className="text-base px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                See What's Possible
                <svg
                  className="ml-2"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </a>
            <a href="/about">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 backdrop-blur-sm bg-background/50 hover:bg-background/80 transition-all duration-300"
              >
                How I Can Help
              </Button>
            </a>
          </div>

          {/* Stats or Tech Stack Icons */}
          <div className="pt-12 flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-muted-foreground">
            <div className="flex flex-col items-center gap-2 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <span className="font-medium">Quality You Trust</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-chart-3/10 flex items-center justify-center group-hover:bg-chart-3/20 transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                  ></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <span className="font-medium">Results On Time</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-chart-2/10 flex items-center justify-center group-hover:bg-chart-2/20 transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span className="font-medium">Built to Grow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="relative z-0 w-full px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          {coursesLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner text="Loading courses..." />
            </div>
          ) : coursesError ? (
            <ErrorBox message="Failed to load courses." />
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <Heading
                  level={2}
                  className="text-3xl md:text-4xl font-bold mb-4"
                >
                  Featured <span className="text-primary">Courses</span>
                </Heading>
                <p className="text-muted-foreground">
                  Level up your skills with our comprehensive courses
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {courses?.map((course) => (
                  <div
                    key={course.id}
                    className="group block bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {course.img_url && (
                      <div className="overflow-hidden aspect-video">
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src={course.img_url}
                          alt={course.title}
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg line-clamp-2 font-semibold mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {course.description}
                      </p>

                      <a
                        className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                        href={`/courses/${course.slug}`}
                      >
                        Start Learning
                        <svg
                          className="w-4 h-4"
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
              {courses && courses.length > 0 && (
                <div className="text-center pt-4">
                  <a
                    className="bg-primary px-4 py-3 hover:opacity-90 text-primary-foreground rounded-md text-sm font-medium transition-all inline-block"
                    href="/courses"
                  >
                    Browse All Courses
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Blog Section */}
      <div className="relative z-0 w-full px-6 md:px-12 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner text="Loading posts..." />
            </div>
          ) : error ? (
            <ErrorBox message="Failed to load blog posts." />
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <Heading
                  level={2}
                  className="text-3xl md:text-4xl font-bold mb-4"
                >
                  Latest Blog Posts
                </Heading>
                <p className="text-muted-foreground">
                  Insights and updates from the world of software development
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {data?.map((post) => (
                  <div
                    key={post.id}
                    className="group block bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {post.img_url && (
                      <div className="overflow-hidden aspect-video">
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src={post.img_url}
                          alt={post.title}
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg line-clamp-2 font-semibold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>

                      <a
                        className="text-emerald-500 text-sm"
                        href={`/blog/${post.slug}`}
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              {data && data.length > 0 && (
                <div className="text-center pt-4">
                  <a
                    className="bg-emerald-600 px-4 py-3 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors"
                    href="/blog"
                  >
                    View All Posts
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
