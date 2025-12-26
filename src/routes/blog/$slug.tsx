import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { BlogPost } from "@/lib/drizzle/schema";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = useParams({ from: "/blog/$slug" });

  const { data, error, isLoading } = useSupabaseQuery<BlogPost>({
    queryKey: [`blog_post_${slug}`],
    tableName: "blog_posts",
    params: { name: "slug", value: slug },
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading Blog Post..." />;
  }

  if (error) {
    return (
      <ErrorBox
        message={
          error.message || "An error occurred while fetching the blog post."
        }
      />
    );
  }

  if (!data || data.length === 0) {
    return <EmptyListPlaceholder text="Blog post not found." />;
  }

  const blogPost = data[0];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>
      <span>Published At: {new Date(blogPost.created_at).toDateString()}</span>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blogPost.content }}
      />
    </div>
  );
}
