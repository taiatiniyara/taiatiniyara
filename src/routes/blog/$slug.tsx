import OtherBlogs from "@/components/blog/otherBlogs";
import BlogComments from "@/components/blog/blogComments";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { BlogPost } from "@/lib/drizzle/schema";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Calendar, Clock, User, Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useStructuredData } from "@/hooks/useStructuredData";
import { DetailPageLayout } from "@/components/ui/detail-page-layout";
import { Breadcrumb, createBreadcrumbs } from "@/components/ui/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { calculateReadTime, openSharePopup, copyToClipboard } from "@/lib/utils";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import type { SocialPlatform } from "@/lib/constants";

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

  // Track reading progress
  const readingProgress = useReadingProgress('blog-content', !!blogPost);

  // Share functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = blogPost?.title || '';

  const handleShare = async (platform: string) => {
    if (platform === 'copy') {
      const success = await copyToClipboard(shareUrl);
      if (success) {
        toast.success('Link copied to clipboard!');
      } else {
        toast.error('Failed to copy link');
      }
      return;
    }

    openSharePopup(platform as SocialPlatform, shareUrl, shareTitle);
  };

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
    <>
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

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
                {/* Breadcrumbs at top */}
                <Breadcrumb 
                  items={createBreadcrumbs("blog", { label: blogPost.title })}
                  className="mb-4 pb-4 border-b"
                />

                <Heading level={1} className="mb-4 leading-tight">{blogPost.title}</Heading>
                
                {/* Meta information */}
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Taia Tiniyara</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={new Date(blogPost.created_at).toISOString()}>
                      {new Date(blogPost.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{calculateReadTime(blogPost.content)} min read</span>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">Share:</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                        onClick={() => handleShare('facebook')}
                        title="Share on Facebook"
                      >
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-colors"
                        onClick={() => handleShare('twitter')}
                        title="Share on Twitter"
                      >
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-colors"
                        onClick={() => handleShare('linkedin')}
                        title="Share on LinkedIn"
                      >
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-colors"
                        onClick={() => handleShare('copy')}
                        title="Copy link"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-muted-foreground italic mb-6 sm:mb-8 pb-6 sm:pb-8 border-b">
                  {blogPost.excerpt}
                </p>
                <div 
                  id="blog-content" 
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted"
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />

                {/* Breadcrumbs at bottom */}
                <Breadcrumb 
                  items={createBreadcrumbs("blog", { label: blogPost.title })}
                  className="mt-8 pt-8 border-t"
                />
              </div>

              {/* Comments Section */}
              <div className="p-4 sm:p-6 md:p-8 pt-0">
                <BlogComments blogPostId={blogPost.id} />
              </div>
            </article>
            <aside className="lg:w-80">
              <OtherBlogs slug={slug} />
            </aside>
          </div>
        )}
      </DetailPageLayout>
    </>
  );
}
