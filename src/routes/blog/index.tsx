import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { BlogPost } from "@/lib/drizzle/schema";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { error, data, isLoading } = useSupabaseQuery<BlogPost>({
    queryKey: ["blog_posts"],
    tableName: "blog_posts",
    fields: ["id", "title", "img_url", "excerpt", "created_at", "slug"],
    orderBy: {
      column: "created_at",
      ascending: false,
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading Blog Posts..." />;
  }
  if (error) {
    return (
      <ErrorBox
        message={
          error.message || "An error occurred while fetching blog posts."
        }
      />
    );
  }
  if (!data || data.length === 0) {
    return <EmptyListPlaceholder text="No blog posts available." />;
  }

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 md:gap-6 sm:gap-4 lg:gap-8 container mx-auto py-8">
      {data.map((post) => (
        <div key={post.id} className="bg-white shadow-md border">
          {post.img_url && (
            <img
              src={post.img_url}
              alt={post.title}
              className="h-48 w-full object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <p className="text-gray-500 text-sm">
              {new Date(post.created_at).toDateString()}
            </p>
            <p className="my-2 line-clamp-3">{post.excerpt}</p>

            <a
              href={`/blog/${post.slug}`}
              className="text-pink-500 font-medium underline w-full inline-block"
            >
              Read more
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
