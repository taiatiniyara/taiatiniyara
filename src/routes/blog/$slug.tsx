import OtherBlogs from "@/components/blog/otherBlogs";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { BlogPost } from "@/lib/drizzle/schema";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useStructuredData } from "@/hooks/useStructuredData";
import { DetailPageLayout } from "@/components/ui/detail-page-layout";

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

  // Add structured data for Article
  useStructuredData(
    blogPost ? {
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
    } : null,
    'blog-structured-data'
  );

  return (
    <DetailPageLayout
      isLoading={isLoading}
      error={error}
      data={data}
      loadingText="Loading Blog Post..."
      errorMessage="An error occurred while fetching the blog post."
      emptyMessage="Blog post not found."
    >
      {blogPost && (
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
      )}
    </DetailPageLayout>
  );
}
