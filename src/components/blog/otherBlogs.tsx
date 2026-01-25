import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { BlogPost } from "@/lib/drizzle/schema";
import LoadingSpinner from "../ui/loading-spinner";
import ErrorBox from "../ui/error";
import EmptyListPlaceholder from "../ui/empty-list-placeholder";
import { Clock, TrendingUp } from "lucide-react";
import { useMemo } from "react";

export default function OtherBlogs({ slug }: { slug?: string }) {
  const { isLoading, error, data } = useSupabaseQuery<BlogPost>({
    queryKey: ["blog_posts_other", slug || "all"],
    tableName: "blog_posts",
    fields: ["slug", "excerpt", "title", "img_url", "created_at", "content"],
    numberOfItems: 20, // Fetch more to ensure variety after randomization
    whereIsNotEqualTo: slug ? { name: "slug", value: slug } : undefined,
  });

  // Randomize and select 4 blogs client-side
  const randomBlogs = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Shuffle array using Fisher-Yates algorithm
    const shuffled = [...data];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, 4);
  }, [data]);

  const calculateReadTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  };

  if (isLoading) return <LoadingSpinner text="Loading Other Blogs..." />;
  if (error)
    return (
      <ErrorBox
        message={
          error.message || "An error occurred while fetching other blog posts."
        }
      />
    );

  if (!data || data.length === 0)
    return (
      <div className="w-full">
        <EmptyListPlaceholder text="No other blog posts available." />
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-4 sticky top-4">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">More Articles</h3>
      </div>
      {randomBlogs.map((post) => (
        <a
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group border shadow-sm bg-card rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300"
        >
          <div className="relative">
            {post.img_url && (
              <img
                src={post.img_url}
                alt={post.title}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>

          <div className="p-4">
            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {post.title}
            </h4>
            <p className="text-xs line-clamp-2 mb-3 text-muted-foreground">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{calculateReadTime(post.content)} min read</span>
              </div>
              <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                Read More
                <svg className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
