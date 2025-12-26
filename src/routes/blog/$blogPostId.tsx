import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { BlogPost } from "@/lib/drizzle/schema";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/$blogPostId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { blogPostId } = useParams({ from: "/blog/$blogPostId" });

  const { data, error, isLoading } = useSupabaseQuery<BlogPost>({
    queryKey: [`blog_post_${blogPostId}`],
    tableName: "blog_posts",
    params: { name: "id", value: blogPostId },
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

  
  return <div>{`Hello "/blog/${blogPostId}"!`}</div>;
}
