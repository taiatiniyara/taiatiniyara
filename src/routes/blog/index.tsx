import { useSupabaseInfiniteQuery } from "@/hooks/useSupabaseInfiniteQuery";
import type { BlogPost } from "@/lib/drizzle/schema";
import { createFileRoute } from "@tanstack/react-router";
import { useSEO } from "@/hooks/useSEO";
import { ContentCard } from "@/components/ui/content-card";
import { DateDisplay } from "@/components/ui/date-display";
import { Heading } from "@/components/ui/heading";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import { useEffect, useRef, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, User, Tag, TrendingUp } from "lucide-react";
import { calculateReadTime } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useSEO({
    title: "Blog - Software Development Insights & Tutorials",
    description: "Read the latest articles, tutorials, and insights on software development, web programming, and technology from Taia Tiniyara. Learn about modern development practices and technologies.",
    keywords: "software development blog, programming tutorials, web development articles, coding blog Fiji, tech insights Pacific",
    canonicalUrl: "/blog",
    ogType: "website",
  });
  
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useSupabaseInfiniteQuery<BlogPost>({
    queryKey: ["blog_posts"],
    tableName: "blog_posts",
    pageSize: 9, // Load 9 posts at a time (3x3 grid)
    orderBy: {
      column: "created_at",
      ascending: false,
    },
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allPosts = data?.pages.flatMap((page) => page.data) || [];

  // Extract categories from posts (you can replace this with actual category field)
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    allPosts.forEach((post) => {
      // For now, we'll extract from keywords or create from title
      // In the future, you should add a proper 'category' or 'tags' field to your schema
      if (post.title) {
        const words = post.title.toLowerCase();
        if (words.includes('react') || words.includes('javascript')) categorySet.add('JavaScript');
        if (words.includes('python')) categorySet.add('Python');
        if (words.includes('web') || words.includes('css')) categorySet.add('Web Development');
        if (words.includes('tutorial')) categorySet.add('Tutorial');
        if (words.includes('guide')) categorySet.add('Guide');
      }
    });
    return Array.from(categorySet);
  }, [allPosts]);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || 
        post.title.toLowerCase().includes(selectedCategory.toLowerCase());
      
      return matchesSearch && matchesCategory;
    });
  }, [allPosts, searchQuery, selectedCategory]);

  const featuredPost = allPosts[0]; // Latest post as featured

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <Heading level={1} className="mb-3 sm:mb-4">
              <span className="text-primary">Blog</span> & Insights
            </Heading>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Thoughts, tutorials, and insights on software development and technology
            </p>
          </div>

          {/* Featured Post Hero */}
          {!isLoading && !error && featuredPost && (
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Featured Post</span>
              </div>
              <a 
                href={`/blog/${featuredPost.slug}`}
                className="group block bg-linear-to-br from-primary/10 via-accent/5 to-transparent border-2 border-primary/20 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="relative h-48 sm:h-64 md:h-full overflow-hidden">
                    <img
                      src={featuredPost.img_url || "/default-image.jpg"}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-background/80 to-transparent md:hidden" />
                  </div>
                  <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        <span>Taia Tiniyara</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{calculateReadTime(featuredPost.content)} min read</span>
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg mb-4 sm:mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="mb-4">
                      <DateDisplay date={featuredPost.created_at} />
                    </div>
                    <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                      Read More
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-5 sm:py-6 text-sm sm:text-base"
              />
            </div>

            {/* Category Filters */}
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <Button
                  variant={!selectedCategory ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-full"
                >
                  All Posts
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                    className="rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}

            {/* Results count */}
            {(searchQuery || selectedCategory) && (
              <div className="text-center text-sm text-muted-foreground">
                Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                {selectedCategory && ` in "${selectedCategory}"`}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
            )}
          </div>

          {error && (
            <ErrorMessage message={error.message || "Failed to load blog posts"} />
          )}

          {isLoading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner text="Loading Blog Posts..." />
            </div>
          )}

          {!isLoading && !error && filteredPosts.length === 0 && (
            <EmptyListPlaceholder text={searchQuery || selectedCategory ? "No blog posts match your search criteria." : "No blog posts available."} />
          )}

          {!isLoading && !error && filteredPosts.length > 0 && (
            <>
              <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.slice(featuredPost ? 1 : 0).map((post) => (
                  <ContentCard
                    key={post.id}
                    title={post.title}
                    imageUrl={post.img_url}
                    imageAlt={post.title}
                    href={`/blog/${post.slug}`}
                  >
                    {/* Author and Read Time */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        <span>Taia Tiniyara</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{calculateReadTime(post.content)} min</span>
                      </div>
                    </div>

                    <DateDisplay date={post.created_at} />
                    <p className="text-muted-foreground line-clamp-3 mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                      Read more
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </ContentCard>
                ))}
              </div>

              {/* Intersection observer target */}
              <div ref={observerTarget} className="py-6 sm:py-8">
                {isFetchingNextPage && (
                  <div className="flex justify-center">
                    <LoadingSpinner text="Loading more posts..." />
                  </div>
                )}
                {!hasNextPage && filteredPosts.length > 3 && (
                  <p className="text-center text-muted-foreground">
                    You've reached the end of the blog posts
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
