import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAllPosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
} from "@/hooks/useBlogQueries";
import type { BlogPost, CreateBlogPostInput } from "@/types/blog";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useAlertDialog } from "@/components/AlertDialogProvider";
import { AdminListItem } from "@/components/AdminListItem";
import { TagInput } from "@/components/TagInput";
import { generateSlug } from "@/lib/admin-utils";
import { AdminRoute } from "@/components/ProtectedRoute";
import { ClipLoader } from "react-spinners";

export const Route = createFileRoute("/blog/admin")({
  component: BlogAdmin,
});

function BlogAdmin() {
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useAlertDialog();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch all posts (including drafts)
  const { data: postsData, isPending: loading } = useAllPosts(1, 100);
  const posts = postsData?.posts || [];

  // Mutations
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [published, setPublished] = useState(false);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setContent("");
    setExcerpt("");
    setFeaturedImage("");
    setTags([]);
    setPublished(false);
    setEditingPost(null);
    setIsCreating(false);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editingPost) {
      setSlug(generateSlug(value));
    }
  };

  const handleAddTag = (tag: string) => {
    setTags([...tags, tag]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleEdit = async (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setExcerpt(post.excerpt || "");
    setFeaturedImage(post.featured_image || "");
    setTags(post.tags || []);
    setPublished(post.published);
    setIsCreating(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startTime = Date.now();
    console.log('=== Blog Admin handleSubmit called ===', new Date().toISOString());
    console.log('Form values:', { 
      title, 
      slug, 
      contentLength: content.length,
      excerpt, 
      featuredImage, 
      tags, 
      published 
    });

    const postData: CreateBlogPostInput = {
      title,
      slug,
      content,
      excerpt: excerpt || undefined,
      featured_image: featuredImage || undefined,
      tags,
      published,
    };

    console.log('postData prepared - content size:', content.length, 'bytes');

    try {
      console.log('About to call mutation at', Date.now() - startTime, 'ms');
      
      if (editingPost) {
        console.log('Updating existing post:', editingPost.id);
        await updatePostMutation.mutateAsync({
          id: editingPost.id,
          input: postData,
        });
        console.log('Update completed at', Date.now() - startTime, 'ms');
      } else {
        console.log('Creating new post');
        await createPostMutation.mutateAsync(postData);
        console.log('Create completed at', Date.now() - startTime, 'ms');
      }
      
      console.log('Total time:', Date.now() - startTime, 'ms');
      console.log('Resetting form...');
      resetForm();
      console.log('Form reset complete');
      showAlert("Success", editingPost ? "Post updated successfully!" : "Post created successfully!");
    } catch (err) {
      const totalTime = Date.now() - startTime;
      console.error('=== handleSubmit caught error after', totalTime, 'ms ===');
      console.error('Error details:', err);
      console.error('Error type:', typeof err);
      console.error('Error instance:', err instanceof Error);
      console.error('Mutation states:', {
        createPending: createPostMutation.isPending,
        updatePending: updatePostMutation.isPending,
        createError: createPostMutation.error,
        updateError: updatePostMutation.error,
      });
      
      // Check for duplicate slug error (409 Conflict)
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes('duplicate') || errorMessage.includes('unique') || errorMessage.includes('23505')) {
        showAlert(
          "Duplicate Slug Error", 
          `A post with the slug "${slug}" already exists. Please use a different title or manually edit the slug.`
        );
      } else {
        showAlert("Error", errorMessage || "Failed to save post");
      }
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      async () => {
        try {
          await deletePostMutation.mutateAsync(id);
        } catch (err) {
          showAlert("Error", err instanceof Error ? err.message : "Failed to delete post");
        }
      }
    );
  };

  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center min-h-100">
            <ClipLoader color="#3b82f6" size={50} />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">Blog Administration</h1>
              <div className="flex gap-4">
                <Button onClick={() => navigate({ to: "/blog" })} variant="outline">
                  View Blog
                </Button>
                {!isCreating && (
                  <Button onClick={() => setIsCreating(true)}>Create New</Button>
                )}
              </div>
            </div>

            {isCreating ? (
        <Card className="p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingPost ? "Edit Post" : "Create New Post"}
              </h2>
              <Button type="button" onClick={resetForm} variant="outline">
                Cancel
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="Enter post title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="post-url-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the post"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Write your post content here..."
                className="min-h-100"
              />
              <p className="text-sm text-gray-500">
                Use the toolbar above for rich text formatting. The editor
                supports headings, lists, links, and more.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <TagInput
              label="Tags"
              tags={tags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              placeholder="Add a tag"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createPostMutation.isPending || updatePostMutation.isPending}
              >
                {createPostMutation.isPending || updatePostMutation.isPending
                  ? "Saving..."
                  : editingPost
                  ? "Update Post"
                  : "Create Post"}
              </Button>
              <Button type="button" onClick={resetForm} variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">All Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-600">No posts yet. Create your first post!</p>
        ) : (
          posts.map((post: any) => (
            <AdminListItem
              key={post.id}
              title={post.title}
              createdAt={post.created_at}
              published={post.published}
              tags={post.tags}
              excerpt={post.excerpt || undefined}
              onView={() => navigate({ to: `/blog/${post.slug}` })}
              onEdit={() => handleEdit(post)}
              onDelete={() => handleDelete(post.id)}
            />
          ))
        )}
      </div>
          </>
        )}
      </div>
    </AdminRoute>
  );
}