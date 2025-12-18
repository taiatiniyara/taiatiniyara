import { createFileRoute, Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SEO } from '@/components/SEO'
import { usePublishedPosts } from '@/hooks/useBlogQueries'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  // Fetch recent blog posts (3 most recent)
  const { data: blogData } = usePublishedPosts(1, 3);
  const recentPosts = blogData?.posts || [];

  return (
    <>
      <SEO
        title="Taia Tiniyara"
        description="Full-Stack Software Developer specializing in systems architecture, database design, and SaaS development."
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Profile Image */}
            <div className="animate-fade-in">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-30 group-hover:opacity-40 transition-opacity duration-300 animate-pulse"></div>
                <img 
                  src="/taia.jpg" 
                  alt="Taia Tiniyara" 
                  className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-2xl ring-4 ring-blue-500/20 dark:ring-blue-400/20 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            
            {/* Text Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-blue-700 dark:text-blue-400 animate-fade-in">
                  Taia Tiniyara
                </h1>
                <div className="h-1 w-24 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full"></div>
              </div>
              <p className="text-2xl lg:text-3xl text-slate-700 dark:text-slate-300 font-medium animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Full-Stack Software Developer
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Crafting elegant solutions through code
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="relative container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Latest from the Blog
            </h2>
            <p className="text-slate-600 dark:text-slate-400">Recent thoughts and insights</p>
          </div>
          {recentPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {recentPosts.map((post, index) => (
                  <Link key={post.id} to={`/blog/$slug`} params={{ slug: post.slug }} className="block group">
                    <Card className={`group relative p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full ${index % 2 === 0 ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' : 'bg-slate-100 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700'}`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="relative space-y-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                          <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          {post.tags && post.tags.length > 0 && (
                            <>
                              <span>•</span>
                              <Badge className="text-xs bg-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-500/30">
                                {post.tags[0]}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
              <div className="text-center">
                <Link to="/blog">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-8">
                    View All Posts →
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 mb-6">No blog posts yet. Check back soon!</p>
              <Link to="/blog">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-8">
                  Visit Blog →
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>


    </div>
    </>
  )
}