import CreateBlogForm from "@/components/blog/createBlog";
import EditBlogForm from "@/components/blog/editBlog";
import { Button } from "@/components/ui/button";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Pencil } from "lucide-react";

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
  const [editingPostId, setEditingPostId] = React.useState<string | null>(null);

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
        <Button 
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingPostId(null);
          }}
        >
          {showCreateForm ? "Cancel" : "Create New Post"}
        </Button>
      </div>
      {showCreateForm ? <CreateBlogForm /> : null}
      {editingPostId ? (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Edit Post</h3>
            <Button 
              variant="outline" 
              onClick={() => setEditingPostId(null)}
            >
              Cancel Edit
            </Button>
          </div>
          <EditBlogForm blogId={editingPostId} />
        </div>
      ) : null}
      {data?.map((post) => (
        <div key={post.id} className="mb-4 p-4 border rounded flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-sm text-gray-500">
              Created at: {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingPostId(post.id);
                setShowCreateForm(false);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
