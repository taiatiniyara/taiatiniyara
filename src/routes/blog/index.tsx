import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { BlogPost } from "@/lib/drizzle/schema";
import { createFileRoute } from "@tanstack/react-router";
import { useSEO } from "@/hooks/useSEO";
import { ContentListPage } from "@/components/ui/content-list-page";
import { ContentCard } from "@/components/ui/content-card";
import { DateDisplay } from "@/components/ui/date-display";

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
  
  const { error, data, isLoading } = useSupabaseQuery<BlogPost>({
    queryKey: ["blog_posts"],
    tableName: "blog_posts",
    fields: ["id", "title", "img_url", "excerpt", "created_at", "slug"],
    orderBy: {
      column: "created_at",
      ascending: false,
    },
  });

  return (
    <ContentListPage
      title={<><span className="text-primary">Blog</span> & Insights</>}
      description="Thoughts, tutorials, and insights on software development and technology"
      data={data}
      isLoading={isLoading}
      error={error}
      emptyText="No blog posts available."
      loadingText="Loading Blog Posts..."
      getItemKey={(post) => post.id}
      renderItem={(post) => (
        <ContentCard
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
      )}
    />
  );
}
