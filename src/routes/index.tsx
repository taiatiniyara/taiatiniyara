import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SEO, StructuredData } from '@/components/SEO'
import { usePublishedPosts, useAllTags, usePostsByTag } from '@/hooks/useBlogQueries'
import { Badge } from '@/components/ui/badge'
import { Calendar, Tag, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Fetch posts based on selected tag or all published posts
  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
  } = selectedTag
    ? usePostsByTag(selectedTag, currentPage, 10)
    : usePublishedPosts(currentPage, 10);

  // Fetch all tags
  const { data: tags = [] } = useAllTags();

  const posts = postsData?.posts || [];
  const totalPages = postsData?.totalPages || 1;
  const loading = postsLoading;
  const error = postsError
    ? postsError instanceof Error
      ? postsError.message
      : 'Failed to load posts'
    : null;

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
          <ClipLoader color="#3b82f6" size={50} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-100">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Taia Tiniyara Blog"
        description="Thoughts on software development, architecture, and technology. Articles about web development, system design, and programming best practices."
      />
      <StructuredData
        type="WebSite"
        data={{
          name: "Taia Tiniyara Blog",
          url: window.location.origin,
          author: {
            "@type": "Person",
            name: "Taia Colai Tiniyara",
          },
        }}
      />
      <div className="min-h-screen">
        {/* Enhanced decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-linear-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-125 h-125 bg-linear-to-tl from-blue-500/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-r from-blue-300/5 to-purple-300/5 rounded-full blur-3xl"></div>
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-[linear-linear(to_right,#80808008_1px,transparent_1px),linear-linear(to_bottom,#80808008_1px,transparent_1px)] bg-size-[64px_64px]"></div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-20 pb-12 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Floating badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6 animate-fade-in">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Latest Insights & Articles</span>
              </div>
              
              {/* Main heading with linear */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fade-in">
                <span className="bg-linear-to-r from-blue-600 via-blue-700 to-purple-600 dark:from-blue-400 dark:via-blue-500 dark:to-purple-400 bg-clip-text text-transparent">
                  Discover Stories
                </span>
                <br />
                <span className="text-slate-800 dark:text-slate-100">& Ideas</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Exploring software development, architecture, and technology through practical insights and real-world experiences
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{posts.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{tags.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Topics</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">∞</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Learning</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="relative container mx-auto px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Tag Filter with enhanced styling */}
            {tags.length > 0 && (
              <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Filter by Topic</h2>
                </div>
                <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
                  <Button
                    variant={selectedTag === null ? 'default' : 'outline'}
                    size="sm"
                    className={selectedTag === null 
                      ? 'bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200' 
                      : 'hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200'
                    }
                    onClick={() => {
                      setSelectedTag(null);
                      setCurrentPage(1);
                    }}
                  >
                    All Posts
                  </Button>
                  {tags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? 'default' : 'outline'}
                      size="sm"
                      className={selectedTag === tag 
                        ? 'bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200' 
                        : 'hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200'
                      }
                      onClick={() => {
                        setSelectedTag(tag);
                        setCurrentPage(1);
                      }}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {posts.map((post, index) => (
                    <Link 
                      key={post.id} 
                      to={`/blog/$slug`} 
                      params={{ slug: post.slug }} 
                      className="block group animate-fade-in" 
                      style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                    >
                      <Card className="group relative p-7 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden h-full bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-white dark:hover:bg-slate-800/70">
                        {/* Decorative linear overlay */}
                        <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-cyan-500/5 transition-all duration-500"></div>
                        
                        {/* Animated corner accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-400/10 to-purple-400/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 group-hover:from-blue-400/20 group-hover:to-purple-400/20 transition-all duration-700"></div>
                        
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
                            <div className="w-full h-2 -mx-7 -mt-7 mb-4 bg-linear-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
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
                              <Badge className="text-xs bg-linear-to-r from-blue-500/20 to-purple-500/20 text-blue-100 dark:text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30 border-0 font-medium">
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
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                              ? 'bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md' 
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
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
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
  )
}
