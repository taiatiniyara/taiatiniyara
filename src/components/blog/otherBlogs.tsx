import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { BlogPost } from "@/lib/drizzle/schema";
import LoadingSpinner from "../ui/loading-spinner";
import ErrorBox from "../ui/error";
import EmptyListPlaceholder from "../ui/empty-list-placeholder";

export default function OtherBlogs({ slug }: { slug?: string }) {
  const { isLoading, error, data } = useSupabaseQuery<BlogPost>({
    queryKey: ["blog_posts_other"],
    tableName: "blog_posts",
    fields: ["slug", "excerpt", "title", "img_url", "created_at"],
    numberOfItems: 3,
    orderBy: {
      column: "created_at",
      ascending: false,
    }
  });
  if (isLoading) return <LoadingSpinner text="Loading Other Blogs..." />;
  if (error)
    return (
      <ErrorBox
        message={
          error.message || "An error occurred while fetching other blog posts."
        }
      />
    );

  if (!data || data.filter((post) => post.slug !== slug).length === 0)
    return (
      <div className="lg:w-[25%]">
        <EmptyListPlaceholder text="No other blog posts available." />
      </div>
    );

  return (
    <div className="lg:w-[25%] flex flex-col gap-4">
      {data
        .filter((post) => post.slug !== slug)
        .slice(0, 3)
        .map((post) => (
          <div key={post.slug} className="mb-4 border shadow-md bg-white">
            {post.img_url && (
              <img
                src={post.img_url}
                alt={post.title}
                className="w-full h-40 object-cover"
              />
            )}

            <div className="p-4">
            <h3 className="text-lg font-bold">{post.title}</h3>
            <p className="text-sm line-clamp-3 my-2">{post.excerpt}</p>
            <a
              href={`/blog/${post.slug}`}
              className="text-pink-500 font-medium underline inline-block"
            >
              Read more
            </a>
            </div>
          </div>
        ))}
    </div>
  );
}
