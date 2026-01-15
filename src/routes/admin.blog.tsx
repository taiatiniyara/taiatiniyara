import CreateBlogForm from "@/components/blog/createBlog";
import EditBlogForm from "@/components/blog/editBlog";
import { AdminHeader } from "@/components/ui/admin-header";
import { FormWrapper } from "@/components/ui/form-wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import type { BlogPost } from "@/lib/drizzle/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBox from "@/components/ui/error";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import { Eye, EyeOff, Pencil, Tag, Calendar, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/admin/blog")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, error, isLoading } = useSupabaseQuery<BlogPost>({
    queryKey: ["admin-blogs"],
    tableName: "blog_posts",
    orderBy: { column: "created_at", ascending: false },
  });

  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [editingPostId, setEditingPostId] = React.useState<string | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<
    "all" | "published" | "draft"
  >("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  if (isLoading) return <LoadingSpinner text="Loading blog posts..." />;
  if (error) return <ErrorBox message={error.message} />;

  // Filter posts based on status
  const filteredPosts = data?.filter((post) => {
    if (filterStatus === "published") return post.is_published;
    if (filterStatus === "draft") return !post.is_published;
    return true;
  });

  const publishedCount = data?.filter((p) => p.is_published).length || 0;
  const draftCount = data?.filter((p) => !p.is_published).length || 0;

  // Pagination calculations
  const totalItems = filteredPosts?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPosts = filteredPosts?.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  if (!data || data.length === 0) {
    return (
      <div className="w-full space-y-6">
        <AdminHeader
          title="Blog Posts"
          description="Manage your blog content"
          buttonText="Create New Post"
          showForm={showCreateForm}
          onToggleForm={() => setShowCreateForm(!showCreateForm)}
        />
        <EmptyListPlaceholder text="No blog posts found. Create your first post!" />
        {showCreateForm && (
          <FormWrapper>
            <CreateBlogForm />
          </FormWrapper>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <AdminHeader
        title="Blog Posts"
        description="Manage your blog content"
        buttonText="Create New Post"
        showForm={showCreateForm}
        onToggleForm={() => {
          setShowCreateForm(!showCreateForm);
          setEditingPostId(null);
        }}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{data.length}</p>
              <p className="text-sm text-muted-foreground">Total Posts</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {publishedCount}
              </p>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {draftCount}
              </p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <EyeOff className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Buttons */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All Posts ({data.length})
          </Button>
          <Button
            variant={filterStatus === "published" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("published")}
          >
            Published ({publishedCount})
          </Button>
          <Button
            variant={filterStatus === "draft" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("draft")}
          >
            Drafts ({draftCount})
          </Button>
        </div>
      </Card>

      {showCreateForm && (
        <FormWrapper>
          <CreateBlogForm />
        </FormWrapper>
      )}

      {editingPostId && (
        <FormWrapper
          title="Edit Blog Post"
          onCancel={() => setEditingPostId(null)}
        >
          <EditBlogForm blogId={editingPostId} />
        </FormWrapper>
      )}

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 gap-4">
        {paginatedPosts && paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => (
            <Card
              key={post.id}
              className="p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image */}
                {post.img_url && (
                  <div className="lg:w-48 h-32 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={post.img_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{post.title}</h3>
                        <Badge
                          variant={post.is_published ? "default" : "secondary"}
                        >
                          {post.is_published ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Draft
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags &&
                    Array.isArray(post.tags) &&
                    post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                  {/* Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(post.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      {post.updated_at !== post.created_at && (
                        <span className="text-xs">
                          Updated{" "}
                          {new Date(post.updated_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {post.is_published && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingPostId(post.id);
                          setShowCreateForm(false);
                        }}
                        className="gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No {filterStatus !== "all" ? filterStatus : ""} posts found.
            </p>
          </Card>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredPosts && filteredPosts.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-md px-2 py-1 bg-background"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-muted-foreground">
                per page | Showing {startIndex + 1}-
                {Math.min(endIndex, totalItems)} of {totalItems}
              </span>
            </div>

            {/* Pagination buttons */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, current page, and pages around current
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, idx, arr) => (
                      <React.Fragment key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-10"
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
