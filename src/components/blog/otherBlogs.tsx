import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { BlogPost } from "@/lib/drizzle/schema";
import LoadingSpinner from "../ui/loading-spinner";
import ErrorBox from "../ui/error";
import EmptyListPlaceholder from "../ui/empty-list-placeholder";

export default function OtherBlogs({ slug }: { slug?: string }) {
  const { isLoading, error, data } = useSupabaseQuery<BlogPost>({
    queryKey: ["blog_posts_other"],
    tableName: "blog_posts",
    fields: ["slug", "excerpt", "title", "img_url", "created_at"],
    numberOfItems: 3,
    orderBy: {
      column: "created_at",
      ascending: false,
    }
  });
  if (isLoading) return <LoadingSpinner text="Loading Other Blogs..." />;
  if (error)
    return (
      <ErrorBox
        message={
          error.message || "An error occurred while fetching other blog posts."
        }
      />
    );

  if (!data || data.filter((post) => post.slug !== slug).length === 0)
    return (
      <div className="w-full">
        <EmptyListPlaceholder text="No other blog posts available." />
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-4">
      {data
        .filter((post) => post.slug !== slug)
        .slice(0, 3)
        .map((post) => (
          <div key={post.slug} className="mb-4 border shadow-md bg-card rounded-lg overflow-hidden">
            {post.img_url && (
              <img
                src={post.img_url}
                alt={post.title}
                className="w-full h-40 object-cover"
              />
            )}

            <div className="p-4">
            <h3 className="text-lg font-bold text-foreground">{post.title}</h3>
            <p className="text-sm line-clamp-3 my-2 text-muted-foreground">{post.excerpt}</p>
            <a
              href={`/blog/${post.slug}`}
              className="text-primary font-medium underline inline-block hover:text-primary/80 transition-colors"
            >
              Read more
            </a>
            </div>
          </div>
        ))}
    </div>
  );
}
