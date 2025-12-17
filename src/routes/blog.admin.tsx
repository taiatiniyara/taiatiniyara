import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  useAllPosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
} from "@/hooks/useBlogQueries";
import { generateSlug } from "@/lib/blog";
import type { BlogPost, CreateBlogPostInput } from "@/types/blog";
import { RichTextEditor } from "@/components/RichTextEditor";

export const Route = createFileRoute("/blog/admin")({
  component: BlogAdmin,
});

function BlogAdmin() {
  const navigate = useNavigate();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch all posts (including drafts)
  const { data: postsData, isLoading: loading } = useAllPosts(1, 100);
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
  const [tagInput, setTagInput] = useState("");
  const [published, setPublished] = useState(false);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setContent("");
    setExcerpt("");
    setFeaturedImage("");
    setTags([]);
    setTagInput("");
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

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
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

    const postData: CreateBlogPostInput = {
      title,
      slug,
      content,
      excerpt: excerpt || undefined,
      featured_image: featuredImage || undefined,
      tags,
      published,
    };

    try {
      if (editingPost) {
        await updatePostMutation.mutateAsync({
          id: editingPost.id,
          input: postData,
        });
      } else {
        await createPostMutation.mutateAsync(postData);
      }
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save post");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await deletePostMutation.mutateAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete post");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-100">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Blog Administration</h1>
        <div className="flex gap-4">
          <Button onClick={() => navigate({ to: "/blog" })} variant="outline">
            View Blog
          </Button>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)}>Create New Post</Button>
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
                Use the toolbar above for rich text formatting. The editor supports headings, lists, links, and more.
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

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a tag"
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

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
              <Button type="submit" className="flex-1">
                {editingPost ? "Update Post" : "Create Post"}
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
          posts.map((post) => (
            <Card key={post.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span>{formatDate(post.created_at)}</span>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  {post.excerpt && (
                    <p className="text-gray-700 text-sm">{post.excerpt}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {post.published && (
                    <Button
                      onClick={() => navigate({ to: `/blog/${post.slug}` })}
                      variant="outline"
                      size="sm"
                    >
                      View
                    </Button>
                  )}
                  <Button
                    onClick={() => handleEdit(post)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(post.id)}
                    variant="outline"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
