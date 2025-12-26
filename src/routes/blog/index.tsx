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
    fields: ["id", "title", "img_url", "excerpt", "created_at"],
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
    <div>
      {data.map((post) => (
        <div key={post.id} className="mb-4 p-4 border">
          {post.img_url && (
            <img
              src={post.img_url}
              alt={post.title}
              className="max-w-full h-auto"
            />
          )}
          <h2 className="text-2xl font-bold mt-2">{post.title}</h2>
          <p className="text-gray-600 text-sm">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
          <p className="mt-2">{post.excerpt}</p>

          <a
            href={`/blog/${post.id}`}
            className="text-blue-500 hover:underline mt-2 inline-block"
          >
            Read more
          </a>
        </div>
      ))}
    </div>
  );
}
