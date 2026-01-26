/**
 * Example Blog List Component with Advanced Caching
 * 
 * This component demonstrates:
 * - Using cache keys and cache times
 * - Prefetching on hover for instant navigation
 * - Cache invalidation after mutations
 * - Optimistic updates for better UX
 * - Cache monitoring
 */

import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { 
  useCacheManager, 
  usePrefetch, 
  useOptimisticUpdate,
  useIsCached,
  useCacheStats 
} from '@/hooks/useCache';
import { cacheKeys, CACHE_TIMES } from '@/lib/cache-config';
import { useEffect } from 'react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  likes: number;
  published_at: string;
}

export function BlogListExample() {
  const cacheManager = useCacheManager();
  const { createPrefetchHandlers } = usePrefetch();
  const optimisticUpdate = useOptimisticUpdate<BlogPost>();
  const getStats = useCacheStats();

  // Fetch blog posts with medium cache time (5 minutes)
  const { data: posts, isLoading, refetch } = useSupabaseQuery<BlogPost>({
    queryKey: cacheKeys.blog.lists(),
    tableName: 'blog_posts',
    orderBy: { column: 'published_at', ascending: false },
    numberOfItems: 20,
    // Data is fresh for 5 minutes, then refetches in background
    staleTime: CACHE_TIMES.MEDIUM,
  });

  // Like a post with optimistic update
  const handleLike = async (post: BlogPost) => {
    await optimisticUpdate(
      cacheKeys.blog.detail(post.slug),
      (old) => old ? { ...old, likes: old.likes + 1 } : post,
      async () => {
        // Actual API call would go here
        await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
      }
    );

    // Invalidate the list to refetch with updated likes
    await cacheManager.invalidateBlog();
  };

  // Refresh all blog data
  const handleRefresh = async () => {
    await cacheManager.invalidateBlog();
    refetch();
  };

  // Get cache statistics for debugging
  const showCacheStats = () => {
    const stats = getStats();
    console.log('Cache Statistics:', stats);
    alert(`
      Total Queries: ${stats.total}
      Fresh: ${stats.fresh}
      Stale: ${stats.stale}
      Active: ${stats.active}
      Success: ${stats.success}
      Error: ${stats.error}
    `);
  };

  if (isLoading) {
    return <div className="p-4">Loading blog posts...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <div className="space-x-2">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Cache
          </button>
          <button
            onClick={showCacheStats}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cache Stats
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {posts?.map((post) => (
          <BlogPostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            prefetchHandlers={createPrefetchHandlers(
              cacheKeys.blog.detail(post.slug),
              () => fetchBlogPost(post.slug),
              CACHE_TIMES.MEDIUM
            )}
          />
        ))}
      </div>
    </div>
  );
}

interface BlogPostCardProps {
  post: BlogPost;
  onLike: (post: BlogPost) => void;
  prefetchHandlers: {
    onMouseEnter: () => void;
    onFocus: () => void;
  };
}

function BlogPostCard({ post, onLike, prefetchHandlers }: BlogPostCardProps) {
  const isCached = useIsCached(cacheKeys.blog.detail(post.slug));

  return (
    <article className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <a
        href={`/blog/${post.slug}`}
        className="block group"
        {...prefetchHandlers}
      >
        <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
          {post.title}
          {isCached && (
            <span className="ml-2 text-xs text-green-600" title="Cached - instant load!">
              ⚡
            </span>
          )}
        </h2>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <time className="text-sm text-gray-500">
          {new Date(post.published_at).toLocaleDateString()}
        </time>
      </a>

      <div className="mt-4 pt-4 border-t">
        <button
          onClick={() => onLike(post)}
          className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
        >
          <span>❤️</span>
          <span>{post.likes} likes</span>
        </button>
      </div>
    </article>
  );
}

// Helper function to fetch a single blog post
async function fetchBlogPost(slug: string): Promise<BlogPost> {
  // This would be replaced with actual Supabase query
  const response = await fetch(`/api/blog/${slug}`);
  return response.json();
}

/**
 * Example of Cache Warmup on App Init
 */
export function AppWithCacheWarmup() {
  const { prefetch } = usePrefetch();

  // Warmup cache on mount
  useEffect(() => {
    // Prefetch commonly accessed data
    prefetch(
      cacheKeys.blog.lists(),
      () => fetch('/api/blog').then(r => r.json()),
      CACHE_TIMES.MEDIUM
    );

    prefetch(
      cacheKeys.courses.lists(),
      () => fetch('/api/courses').then(r => r.json()),
      CACHE_TIMES.LONG
    );
  }, [prefetch]);

  return <div>{/* App content */}</div>;
}

/**
 * Example of Manual Cache Management
 */
export function AdminCacheManager() {
  const cache = useCacheManager();

  const clearBlogCache = () => {
    cache.invalidateBlog();
    console.log('Blog cache cleared!');
  };

  const clearAllCache = () => {
    cache.clearAllCache();
    console.log('All cache cleared!');
  };

  const preloadCourses = async () => {
    await cache.prefetch(
      cacheKeys.courses.lists(),
      () => fetch('/api/courses').then(r => r.json()),
      CACHE_TIMES.LONG
    );
    console.log('Courses preloaded!');
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Cache Management</h2>
      
      <div className="space-x-2">
        <button
          onClick={clearBlogCache}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Clear Blog Cache
        </button>
        
        <button
          onClick={clearAllCache}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear All Cache
        </button>
        
        <button
          onClick={preloadCourses}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Preload Courses
        </button>
      </div>
    </div>
  );
}
