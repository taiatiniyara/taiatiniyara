import OtherBlogs from "@/components/blog/otherBlogs";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { BlogPost } from "@/lib/drizzle/schema";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Calendar } from "lucide-react";

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

  if (!data || data.length === 0) {
    return <EmptyListPlaceholder text="Blog post not found." />;
  }

  const blogPost = data[0];

  return (
    <div className="lg:mx-[15%] md:mx-[10%] sm:px-4 lg:flex-row flex flex-col gap-8 py-8">
      <article className="lg:w-[75%] flex flex-col">
        <img
          src={blogPost.img_url || "/default-image.jpg"}
          alt={blogPost.title}
          className="mb-6 rounded-lg h-96 w-full object-cover shadow-lg"
        />
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{blogPost.title}</h1>
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <Calendar size={18} />
          <time dateTime={new Date(blogPost.created_at).toISOString()}>
            {new Date(blogPost.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
        <p className="text-lg text-muted-foreground italic py-4 mb-6 border-b border-border">
          {blogPost.excerpt}
        </p>
        <div 
          id="blog-content" 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blogPost.content }}
        />
      </article>
      <OtherBlogs slug={slug} />
    </div>
  );
}
