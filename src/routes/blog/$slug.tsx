import OtherBlogs from "@/components/blog/otherBlogs";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { BlogPost } from "@/lib/drizzle/schema";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { useSEO, createStructuredData } from "@/hooks/useSEO";
import { useEffect } from "react";

export const Route = createFileRoute("/blog/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = useParams({ from: "/blog/$slug" });

  const { data, error, isLoading } = useSupabaseQuery<BlogPost>({
    queryKey: [`blog_post_${slug}`],
    tableName: "blog_posts",
    params: { name: "slug", value: slug },
  });

  const blogPost = data?.[0];

  // SEO optimization - must be called at top level before conditional returns
  useSEO({
    title: blogPost?.title,
    description: blogPost?.excerpt || blogPost?.title,
    keywords: blogPost ? `blog, ${blogPost.title}, software development, programming` : undefined,
    canonicalUrl: `/blog/${slug}`,
    ogType: "article",
    ogImage: blogPost?.img_url || undefined,
    publishedTime: blogPost ? new Date(blogPost.created_at).toISOString() : undefined,
    modifiedTime: blogPost?.updated_at ? new Date(blogPost.updated_at).toISOString() : undefined,
  });

  // Add structured data for Article - must be at top level
  useEffect(() => {
    if (!blogPost) return;

    const structuredData = createStructuredData({
      '@type': 'BlogPosting',
      headline: blogPost.title,
      description: blogPost.excerpt || blogPost.title,
      image: blogPost.img_url || 'https://taiatiniyara.com/og-image.jpg',
      datePublished: new Date(blogPost.created_at).toISOString(),
      dateModified: blogPost.updated_at ? new Date(blogPost.updated_at).toISOString() : new Date(blogPost.created_at).toISOString(),
      author: {
        '@type': 'Person',
        name: 'Taia Tiniyara',
        url: 'https://taiatiniyara.com/about'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Taia Tiniyara',
        logo: {
          '@type': 'ImageObject',
          url: 'https://taiatiniyara.com/logo.svg'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://taiatiniyara.com/blog/${slug}`
      }
    });

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = structuredData;
    script.id = 'blog-structured-data';
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('blog-structured-data');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [blogPost, slug]);

  if (isLoading) {
    return <LoadingSpinner text="Loading Blog Post..." />;
  }

  if (error) {
    return (
      <ErrorBox
        message={
          error.message || "An error occurred while fetching the blog post."
        }
      />
    );
  }

  if (!data || data.length === 0 || !blogPost) {
    return <EmptyListPlaceholder text="Blog post not found." />;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
          <article className="flex-1 bg-card border rounded-lg overflow-hidden shadow-md">
            <img
              src={blogPost.img_url || "/default-image.jpg"}
              alt={blogPost.title}
              className="w-full h-48 sm:h-64 md:h-96 object-cover"
            />
            <div className="p-4 sm:p-6 md:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{blogPost.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
              <Calendar size={16} className="sm:w-4.5 sm:h-4.5" />
              <time dateTime={new Date(blogPost.created_at).toISOString()}>
                {new Date(blogPost.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground italic mb-6 sm:mb-8 pb-6 sm:pb-8 border-b">
              {blogPost.excerpt}
            </p>
            <div 
              id="blog-content" 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />
            </div>
          </article>
          <aside className="lg:w-80">
            <OtherBlogs slug={slug} />
          </aside>
        </div>
      </div>
    </div>
  );
}
