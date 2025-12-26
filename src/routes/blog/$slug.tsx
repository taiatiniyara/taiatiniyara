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
    <div className="lg:mx-[15%] md:mx-[10%] sm:mx-4 lg:flex-row flex flex-col gap-4 my-8">
      <div className="lg:w-[75%]">
        <img
          src={blogPost.img_url || "/default-image.jpg"}
          alt={blogPost.title}
          className="mb-4 h-75 w-full object-cover"
        />
        <h1 className="text-2xl font-bold">{blogPost.title}</h1>
        <span className="text-gray-500 text-sm flex items-center gap-1 mt-2">
          <Calendar size={18} />{new Date(blogPost.created_at).toDateString()}
        </span>
        <p className=" text-gray-500 italic py-2 border-b">{blogPost.excerpt}</p>
        <div className="py-4"
          dangerouslySetInnerHTML={{ __html: blogPost.content }}
        />
      </div>
      <OtherBlogs slug={slug} />
    </div>
  );
}
