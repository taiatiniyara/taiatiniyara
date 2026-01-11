import { useSupabaseInfiniteQuery } from "@/hooks/useSupabaseInfiniteQuery";
import type { BlogPost } from "@/lib/drizzle/schema";
import { createFileRoute } from "@tanstack/react-router";
import { useSEO } from "@/hooks/useSEO";
import { ContentCard } from "@/components/ui/content-card";
import { DateDisplay } from "@/components/ui/date-display";
import { Heading } from "@/components/ui/heading";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/blog/")({
  component: RouteComponent,
});

function RouteComponent() {
  useSEO({
    title: "Blog - Software Development Insights & Tutorials",
    description: "Read the latest articles, tutorials, and insights on software development, web programming, and technology from Taia Tiniyara. Learn about modern development practices and technologies.",
    keywords: "software development blog, programming tutorials, web development articles, coding blog Fiji, tech insights Pacific",
    canonicalUrl: "/blog",
    ogType: "website",
  });
  
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useSupabaseInfiniteQuery<BlogPost>({
    queryKey: ["blog_posts"],
    tableName: "blog_posts",
    pageSize: 6, // Load 6 posts at a time
    orderBy: {
      column: "created_at",
      ascending: false,
    },
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allPosts = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={1} className="mb-4">
              <span className="text-primary">Blog</span> & Insights
            </Heading>
            <p className="text-muted-foreground text-lg">
              Thoughts, tutorials, and insights on software development and technology
            </p>
          </div>

          {error && (
            <ErrorMessage message={error.message || "Failed to load blog posts"} />
          )}

          {isLoading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner text="Loading Blog Posts..." />
            </div>
          )}

          {!isLoading && !error && allPosts.length === 0 && (
            <EmptyListPlaceholder text="No blog posts available." />
          )}

          {!isLoading && !error && allPosts.length > 0 && (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {allPosts.map((post) => (
                  <ContentCard
                    key={post.id}
                    title={post.title}
                    imageUrl={post.img_url}
                    imageAlt={post.title}
                    href={`/blog/${post.slug}`}
                  >
                    <DateDisplay date={post.created_at} />
                    <p className="text-muted-foreground line-clamp-3 mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-emerald-500 font-medium group-hover:gap-2 transition-all">
                      Read more
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </ContentCard>
                ))}
              </div>

              {/* Intersection observer target */}
              <div ref={observerTarget} className="py-8">
                {isFetchingNextPage && (
                  <div className="flex justify-center">
                    <LoadingSpinner text="Loading more posts..." />
                  </div>
                )}
                {!hasNextPage && allPosts.length > 0 && (
                  <p className="text-center text-muted-foreground">
                    You've reached the end of the blog posts
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
