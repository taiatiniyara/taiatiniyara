import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublishedPosts } from "@/lib/blog";
import type { BlogPost } from "@/types/blog";
import { SEO, StructuredData } from "@/components/SEO";
import { Calendar, Tag, TrendingUp } from "lucide-react";
import { DecorativeBackground } from "@/components/DecorativeBackground";
import { PageHeader } from "@/components/PageHeader";
import { StatsDisplay } from "@/components/StatsDisplay";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
});

function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, _setSelectedTag] = useState<string | null>(null);
  
  const postsPerPage = 9;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: number | null = null;

    const fetchPosts = async (retries = 3) => {
      try {
        const data = await getPublishedPosts();
        if (!isMounted) return;
        
        setPosts(data);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        
        console.error('Error fetching blog posts:', err);
        
        // Retry logic for network errors
        if (retries > 0 && err instanceof Error && 
            (err.message.includes('fetch') || err.message.includes('network'))) {
          console.log(`Retrying blog posts... (${3 - retries + 1}/3)`);
          retryTimeout = setTimeout(() => fetchPosts(retries - 1), 1000 * (4 - retries));
          return;
        }
        
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchPosts();

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, []);

  const loading = isLoading;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Blog Posts</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            Please check your internet connection or try again later.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
            <Button variant="outline" onClick={() => {
              setIsLoading(true);
              setError(null);
              const retryFetch = async (retries = 3) => {
                try {
                  const data = await getPublishedPosts();
                  setPosts(data);
                  setError(null);
                } catch (err) {
                  console.error('Error fetching blog posts:', err);
                  
                  if (retries > 0) {
                    console.log(`Retrying... (${3 - retries + 1}/3)`);
                    setTimeout(() => retryFetch(retries - 1), 1000 * (4 - retries));
                    return;
                  }
                  
                  setError(err instanceof Error ? err.message : 'Unknown error');
                } finally {
                  if (retries === 0) {
                    setIsLoading(false);
                  }
                }
              };
              retryFetch();
            }}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Blog - Software Development Insights & Tutorials"
        description="In-depth articles on software development, systems architecture, web development, database design, and programming best practices. Learn from real-world experiences building scalable applications."
        canonicalUrl="https://taiatiniyara.com/blog"
        ogType="website"
      />
      <StructuredData
        type="WebSite"
        data={{
          name: "Taia Tiniyara Blog",
          description: "Software development insights, tutorials, and best practices",
          url: `${window.location.origin}/blog`,
          author: {
            "@type": "Person",
            name: "Taia Tiniyara",
            url: window.location.origin,
          },
          publisher: {
            "@type": "Person",
            name: "Taia Tiniyara",
          },
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: window.location.origin,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: `${window.location.origin}/blog`,
            },
          ],
        }}
      />
      <div className="min-h-screen">
        <DecorativeBackground />

        <PageHeader
          badge={{ icon: TrendingUp, text: "Latest Insights & Articles" }}
          title="Blog & Insights"
          description="Thoughts on software development, architecture, and technology"
        >
          <StatsDisplay
            stats={[
              { value: posts.length, label: "Articles", color: "blue" },
              { value: "∞", label: "Learning", color: "blue" },
            ]}
          />

          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/blog/admin">
              <Button variant="outline" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600">
                Admin
              </Button>
            </Link>
          </div>
        </PageHeader>

        {/* Blog Section */}
        <section className="relative container mx-auto px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {posts.map((post: BlogPost, index: number) => (
                    <Link 
                      key={post.id} 
                      to={`/blog/$slug`} 
                      params={{ slug: post.slug }} 
                      className="block group animate-fade-in" 
                      style={{ animationDelay: `${0.5 + index * 0.05}s` }}
                    >
                      <Card className="group relative p-7 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden h-full bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-white dark:hover:bg-slate-800/70">
                        {/* Decorative overlay */}
                        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-all duration-500"></div>
                        
                        {/* Animated corner accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 group-hover:bg-blue-400/20 transition-all duration-700"></div>
                        
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
                        
                        <div className="relative space-y-4">
                          {/* Featured image placeholder with linear */}
                          {post.featured_image && (
                            <div className="w-full h-48 -mx-7 -mt-7 mb-4 overflow-hidden">
                              <img 
                                src={post.featured_image} 
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            </div>
                          )}
                          
                          {!post.featured_image && (
                            <div className="w-full h-2 -mx-7 -mt-7 mb-4 bg-blue-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                          )}
                          
                          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                            {post.title}
                          </h2>
                          
                          {post.excerpt && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formatDate(post.published_at || post.created_at)}</span>
                            </div>
                            
                            {post.tags && post.tags.length > 0 && (
                              <Badge className="text-xs bg-blue-500 text-white dark:text-blue-300 hover:bg-blue-500/30 border-0 font-medium">
                                {post.tags[0]}
                              </Badge>
                            )}
                            
                            {post.tags && post.tags.length > 1 && (
                              <span className="text-xs text-slate-400 dark:text-slate-600">
                                +{post.tags.length - 1} more
                              </span>
                            )}
                          </div>
                          
                          {/* Read more indicator */}
                          <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span>Read article</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-16 animate-fade-in">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600 disabled:opacity-30 transition-all"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page 
                              ? 'bg-blue-600 hover:bg-blue-700 shadow-md' 
                              : 'hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600 transition-all'
                            }
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev: number) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600 disabled:opacity-30 transition-all"
                    >
                      Next
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Tag className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {selectedTag
                    ? `No posts found with tag "${selectedTag}"`
                    : 'No blog posts published yet.'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  {selectedTag ? 'Try selecting a different topic' : 'Check back soon for new content!'}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
