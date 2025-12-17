import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePostBySlug } from '@/hooks/useBlogQueries';
import { SEO, StructuredData } from '@/components/SEO';

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  
  const { data: post, isLoading: loading, error: queryError } = usePostBySlug(slug);

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
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-100">
          <div className="text-lg">Loading post...</div>
        </div>
      </div>
    );
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

  return (
    <>
      <SEO
        title={post.title}
        description={excerpt}
        canonicalUrl={postUrl}
        ogType="article"
        ogImage={post.featured_image || undefined}
        publishedTime={post.published_at || undefined}
        modifiedTime={post.updated_at}
        tags={post.tags}
      />
      <StructuredData
        type="BlogPosting"
        data={{
          headline: post.title,
          description: excerpt,
          image: post.featured_image || `${siteUrl}/circle.svg`,
          datePublished: post.published_at,
          dateModified: post.updated_at,
          author: {
            '@type': 'Person',
            name: 'Taia Colai Tiniyara',
            url: siteUrl,
          },
          publisher: {
            '@type': 'Person',
            name: 'Taia Colai Tiniyara',
            url: siteUrl,
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': postUrl,
          },
          keywords: post.tags?.join(', '),
        }}
      />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link to="/blog" className="inline-flex items-center text-blue-600 hover:underline mb-8">
          ← Back to Blog
        </Link>

        <article>
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
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
        />
      </article>

        <footer className="mt-16 pt-8 border-t">
          <Button onClick={() => navigate({ to: '/blog' })} variant="outline">
            ← Back to All Posts
          </Button>
        </footer>
      </div>
    </>
  );
}

// Simple markdown-like formatting for content
// For production, consider using a library like marked or react-markdown
function formatContent(content: string): string {
  // Convert markdown-style formatting to HTML
  let html = content;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-10 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-12 mb-4">$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>');
  
  // Inline code
  html = html.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>');
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p class="mb-4">');
  html = '<p class="mb-4">' + html + '</p>';
  
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  
  return html;
}
