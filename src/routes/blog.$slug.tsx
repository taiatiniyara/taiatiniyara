import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePostBySlug, usePublishedPosts } from '@/hooks/useBlogQueries';
import { SEO, StructuredData } from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  
  const { data: post, isLoading: loading, error: queryError } = usePostBySlug(slug);
  const { data: postsData } = usePublishedPosts(1, 10);

  // Check if post is not found or not published
  let error: string | null = null;
  if (queryError) {
    error = queryError instanceof Error ? queryError.message : 'Failed to load post';
  } else if (!loading && !post) {
    error = 'Blog post not found';
  } else if (post && !post.published) {
    error = 'This post is not yet published';
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-100">
          <div className="text-lg text-red-600 mb-4">
            {error || 'Post not found'}
          </div>
          <Button onClick={() => navigate({ to: '/blog' })}>
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const siteUrl = window.location.origin;
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const excerpt = post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, '');

  // Get other blog posts (exclude current post and limit to 3)
  const otherPosts = postsData?.posts
    .filter(p => p.slug !== slug)
    .slice(0, 3) || [];

  return (
    <>
      <SEO
        title={post.title}
        description={excerpt}
        canonicalUrl={postUrl}
        ogType="article"
        ogImage={post.featured_image || undefined}
        ogImageAlt={post.title}
        publishedTime={post.published_at || undefined}
        modifiedTime={post.updated_at}
        tags={post.tags}
      />
      <StructuredData
        type="BlogPosting"
        data={{
          headline: post.title,
          description: excerpt,
          image: post.featured_image || `${siteUrl}/taia.jpg`,
          datePublished: post.published_at,
          dateModified: post.updated_at,
          author: {
            '@type': 'Person',
            name: 'Taia Tiniyara',
            url: siteUrl,
          },
          publisher: {
            '@type': 'Person',
            name: 'Taia Tiniyara',
            url: siteUrl,
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': postUrl,
          },
          keywords: post.tags?.join(', '),
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: siteUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog',
              item: `${siteUrl}/blog`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: post.title,
              item: postUrl,
            },
          ],
        }}
      />
      <div className="container mx-auto px-4 py-16">
        <Link to="/blog" className="inline-flex items-center text-blue-600 hover:underline mb-8">
          ← Back to Blog
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          <article className="flex-1 max-w-4xl">
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-gray-600 mb-4">
            {post.published_at && (
              <time dateTime={post.published_at}>
                {formatDate(post.published_at)}
              </time>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {post.excerpt && (
          <div className="text-xl text-gray-700 italic mb-8 pb-8 border-b">
            {post.excerpt}
          </div>
        )}

        <div 
          className="blog-content prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="mt-16 pt-8 border-t">
          <Button onClick={() => navigate({ to: '/blog' })} variant="outline">
            ← Back to All Posts
          </Button>
        </footer>
      </article>

          {/* Sidebar with other blog posts */}
          {otherPosts.length > 0 && (
            <aside className="lg:w-80 shrink-0">
              <div className="sticky top-8">
                <h3 className="text-xl font-semibold mb-4">Other Blog Posts</h3>
                <div className="space-y-4">
                  {otherPosts.map((otherPost) => (
                    <Card key={otherPost.id} className="p-4 hover:shadow-lg transition-shadow">
                      <Link 
                        to="/blog/$slug" 
                        params={{ slug: otherPost.slug }}
                        className="block"
                      >
                        {otherPost.featured_image && (
                          <img
                            src={otherPost.featured_image}
                            alt={otherPost.title}
                            className="w-full h-32 object-cover rounded mb-3"
                          />
                        )}
                        <h4 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-blue-600">
                          {otherPost.title}
                        </h4>
                        {otherPost.excerpt && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {otherPost.excerpt}
                          </p>
                        )}
                        {otherPost.published_at && (
                          <time className="text-xs text-gray-500 mt-2 block">
                            {formatDate(otherPost.published_at)}
                          </time>
                        )}
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
