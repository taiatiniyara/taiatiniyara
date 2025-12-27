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
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">Blog Posts</h2>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Button 
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingPostId(null);
          }}
          size="lg"
        >
          {showCreateForm ? "Cancel" : "Create New Post"}
        </Button>
      </div>
      
      {showCreateForm ? (
        <div className="bg-card border rounded-lg p-6 shadow-md">
          <CreateBlogForm />
        </div>
      ) : null}
      
      {editingPostId ? (
        <div className="bg-card border rounded-lg p-6 shadow-md">
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
      
      <div className="space-y-4">
        {data?.map((post) => (
          <div key={post.id} className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Created: {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingPostId(post.id);
                  setShowCreateForm(false);
                }}
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
