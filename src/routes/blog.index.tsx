import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  usePublishedPosts,
  useAllTags,
  usePostsByTag,
} from "@/hooks/useBlogQueries";
import { SEO, StructuredData } from "@/components/SEO";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
});

function BlogIndex() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Fetch posts based on selected tag or all published posts
  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
  } = selectedTag
    ? usePostsByTag(selectedTag, currentPage, 10)
    : usePublishedPosts(currentPage, 10);

  // Fetch all tags
  const { data: tags = [] } = useAllTags();

  const posts = postsData?.posts || [];
  const totalPages = postsData?.totalPages || 1;
  const loading = postsLoading;
  const error = postsError
    ? postsError instanceof Error
      ? postsError.message
      : "Failed to load posts"
    : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-100">
          <ClipLoader color="#3b82f6" size={50} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-100">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Blog"
        description="Thoughts on software development, architecture, and technology. Articles about web development, system design, and programming best practices."
      />
      <StructuredData
        type="WebSite"
        data={{
          name: "Taia Tiniyara Blog",
          url: `${window.location.origin}/blog`,
          author: {
            "@type": "Person",
            name: "Taia Colai Tiniyara",
          },
        }}
      />
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="mb-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-4">Blog</h1>
              <p className="text-lg text-gray-600">
                Thoughts on software development, architecture, and technology
              </p>
            </div>
            <Link to="/blog/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
              >
                All
              </Button>
              {tags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">No blog posts yet.</p>
            <p className="text-gray-500">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="block group"
                >
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    {post.published_at && (
                      <span>{formatDate(post.published_at)}</span>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  {post.excerpt && (
                    <p className="text-gray-700 mb-4">{post.excerpt}</p>
                  )}
                  <span className="text-blue-600 font-medium group-hover:underline">
                    Read more →
                  </span>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
