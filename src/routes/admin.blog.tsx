import CreateBlogForm from "@/components/blog/createBlog";
import EditBlogForm from "@/components/blog/editBlog";
import { AdminCrudPage } from "@/components/ui/admin-crud-page";
import { ItemCard } from "@/components/ui/item-card";
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
  const [editingPostId, setEditingPostId] = React.useState<string | null>(null);

  return (
    <AdminCrudPage
      title="Blog Posts"
      description="Manage your blog content"
      createButtonText="Create New Post"
      emptyText="No blog posts found."
      loadingText="Loading posts..."
      data={data}
      isLoading={isLoading}
      error={error}
      showCreateForm={showCreateForm}
      editingItemId={editingPostId}
      onToggleCreateForm={() => {
        setShowCreateForm(!showCreateForm);
        setEditingPostId(null);
      }}
      onCancelEdit={() => setEditingPostId(null)}
      renderCreateForm={() => <CreateBlogForm />}
      renderEditForm={(id) => <EditBlogForm blogId={id} />}
      renderItem={(post) => (
        <ItemCard
          title={post.title}
          createdAt={post.created_at}
          onEdit={() => {
            setEditingPostId(post.id);
            setShowCreateForm(false);
          }}
        />
      )}
    />
  );
}
