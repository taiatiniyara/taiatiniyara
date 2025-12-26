import CreateBlogForm from "@/components/blog/createBlog";
import { Button } from "@/components/ui/button";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/admin/blog")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, error, isLoading } = useSupabaseQuery({
    queryKey: ["admin-blogs"],
    tableName: "blog_posts",
    fields: ["id", "title", "created_at"],
  });

  const [showCreateForm, setShowCreateForm] = React.useState(false);

  if (isLoading) return <LoadingSpinner text="Loading posts..." />;
  if (error) return <ErrorBox message={error.message} />;
  if (data && data.length === 0) {
    return (
      <div className="w-full">
        <EmptyListPlaceholder text="No blog posts found." />
        <CreateBlogForm />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between gap-12 w-full mb-4">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? "Cancel" : "Create New Post"}
        </Button>
      </div>
      {showCreateForm ? <CreateBlogForm /> : null}
      {data?.map((post) => (
        <div key={post.id} className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-sm text-gray-500">
            Created at: {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
