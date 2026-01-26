# Caching System Documentation

## Overview

This application now includes a comprehensive, multi-layered caching system designed for optimal performance and offline capabilities.

## Caching Layers

### 1. React Query Cache (In-Memory)
- **Location**: `src/lib/cache-config.ts`
- **Purpose**: Primary data caching for API requests
- **Features**:
  - Automatic cache invalidation
  - Smart refetching strategies
  - Optimistic updates
  - Persistent cache with localStorage/IndexedDB

### 2. Service Worker Cache (Offline)
- **Location**: PWA plugin in `vite.config.ts`
- **Purpose**: Offline asset caching
- **Caches**:
  - Static assets (JS, CSS, images)
  - Google Fonts
  - Supabase API responses
  - Navigation requests

### 3. IndexedDB Cache (Persistent)
- **Location**: `src/lib/cache-utils.ts`
- **Purpose**: Long-term offline storage
- **Features**:
  - Stores blog posts, courses, and assets
  - Automatic expiration (24 hours)
  - Fallback to localStorage

### 4. Memory Cache (Fast Access)
- **Location**: `src/lib/cache-utils.ts`
- **Purpose**: Ultra-fast in-memory caching
- **Features**:
  - Configurable TTL
  - Automatic cleanup of expired entries

## Cache Configuration

### Cache Times

```typescript
import { CACHE_TIMES } from '@/lib/cache-config';

// Available cache times:
CACHE_TIMES.REALTIME    // 0ms - no caching
CACHE_TIMES.SHORT       // 30 seconds
CACHE_TIMES.MEDIUM      // 5 minutes (default)
CACHE_TIMES.LONG        // 30 minutes
CACHE_TIMES.VERY_LONG   // 1 hour
CACHE_TIMES.STATIC      // 24 hours
```

### Cache Keys

Use consistent cache keys for predictable invalidation:

```typescript
import { cacheKeys } from '@/lib/cache-config';

// Blog
cacheKeys.blog.all                    // ['blog']
cacheKeys.blog.detail('my-post')      // ['blog', 'detail', 'my-post']
cacheKeys.blog.comments('post-id')    // ['blog', 'detail', 'post-id', 'comments']

// Courses
cacheKeys.courses.detail('react-101')              // ['courses', 'detail', 'react-101']
cacheKeys.courses.lesson('react-101', 'lesson-1')  // ['courses', 'detail', 'react-101', 'lessons', 'lesson-1']

// Users
cacheKeys.users.current()             // ['users', 'current']
cacheKeys.users.profile('user-id')    // ['users', 'profile', 'user-id']
```

## Usage Examples

### 1. Basic Query with Caching

```typescript
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { cacheKeys, CACHE_TIMES } from '@/lib/cache-config';

function BlogPost({ slug }: { slug: string }) {
  const { data, isLoading } = useSupabaseQuery({
    queryKey: cacheKeys.blog.detail(slug),
    tableName: 'blog_posts',
    params: { name: 'slug', value: slug },
    // Override default cache time for this query
    staleTime: CACHE_TIMES.LONG,
  });

  // ...
}
```

### 2. Cache Invalidation

```typescript
import { useCacheManager } from '@/hooks/useCache';

function UpdateBlogPost() {
  const cacheManager = useCacheManager();

  const handleUpdate = async (slug: string) => {
    // Update the post...
    
    // Invalidate specific post cache
    await cacheManager.invalidateBlogPost(slug);
    
    // Or invalidate all blog posts
    await cacheManager.invalidateBlog();
  };

  // ...
}
```

### 3. Optimistic Updates

```typescript
import { useOptimisticUpdate } from '@/hooks/useCache';
import { cacheKeys } from '@/lib/cache-config';

function LikeButton({ postId }: { postId: string }) {
  const optimisticUpdate = useOptimisticUpdate<BlogPost>();

  const handleLike = async () => {
    await optimisticUpdate(
      cacheKeys.blog.detail(postId),
      (old) => ({ ...old, likes: (old?.likes || 0) + 1 }),
      () => api.likePost(postId)
    );
  };

  // ...
}
```

### 4. Prefetching for Better UX

```typescript
import { usePrefetch } from '@/hooks/useCache';
import { cacheKeys, CACHE_TIMES } from '@/lib/cache-config';

function BlogPostLink({ slug }: { slug: string }) {
  const { createPrefetchHandlers } = usePrefetch();

  const prefetchHandlers = createPrefetchHandlers(
    cacheKeys.blog.detail(slug),
    () => fetchBlogPost(slug),
    CACHE_TIMES.MEDIUM
  );

  return (
    <Link 
      to={`/blog/${slug}`}
      {...prefetchHandlers}  // Prefetches on hover/focus
    >
      Read Post
    </Link>
  );
}
```

### 5. Manual Cache Control

```typescript
import { useCacheManager } from '@/hooks/useCache';
import { cacheKeys } from '@/lib/cache-config';

function AdminPanel() {
  const cache = useCacheManager();

  // Get cached data without refetching
  const cachedPost = cache.getCachedData(cacheKeys.blog.detail('my-post'));

  // Set cache data manually
  cache.setCacheData(cacheKeys.blog.detail('new-post'), newPostData);

  // Clear specific cache
  cache.removeCache(cacheKeys.blog.detail('old-post'));

  // Clear all cache
  cache.clearAllCache();

  // ...
}
```

### 6. Cache Warmup

```typescript
import { useCacheWarmup } from '@/hooks/useCache';
import { cacheKeys, CACHE_TIMES } from '@/lib/cache-config';

function App() {
  const warmup = useCacheWarmup();

  useEffect(() => {
    // Preload critical data on app load
    warmup([
      {
        queryKey: cacheKeys.users.current(),
        queryFn: () => fetchCurrentUser(),
        staleTime: CACHE_TIMES.LONG,
      },
      {
        queryKey: cacheKeys.courses.lists(),
        queryFn: () => fetchCourses(),
        staleTime: CACHE_TIMES.LONG,
      },
    ]);
  }, []);

  // ...
}
```

### 7. IndexedDB Cache

```typescript
import { IndexedDBCache } from '@/lib/cache-utils';

const idbCache = new IndexedDBCache();

// Initialize
await idbCache.init();

// Store data
await idbCache.set('blog', 'my-post-slug', postData);

// Retrieve data
const cachedPost = await idbCache.get('blog', 'my-post-slug');

// Delete data
await idbCache.delete('blog', 'my-post-slug');

// Clear all from a store
await idbCache.clear('blog');
```

### 8. Memory Cache

```typescript
import { MemoryCache } from '@/lib/cache-utils';

const memCache = new MemoryCache();

// Set with default TTL (5 minutes)
memCache.set('user-data', userData);

// Set with custom TTL (1 hour)
memCache.set('static-config', config, 60 * 60 * 1000);

// Get data
const cached = memCache.get('user-data');

// Check if exists
if (memCache.has('user-data')) {
  // ...
}

// Clean up expired entries
memCache.cleanup();
```

## Cache Monitoring

### Get Cache Statistics

```typescript
import { useCacheStats } from '@/hooks/useCache';

function CacheMonitor() {
  const getStats = useCacheStats();
  const stats = getStats();

  console.log('Cache stats:', {
    total: stats.total,      // Total queries in cache
    active: stats.active,    // Currently fetching
    stale: stats.stale,      // Needs refetch
    fresh: stats.fresh,      // Fresh data
    error: stats.error,      // Failed queries
    success: stats.success,  // Successful queries
  });

  // ...
}
```

### Check if Data is Cached

```typescript
import { useIsCached } from '@/hooks/useCache';
import { cacheKeys } from '@/lib/cache-config';

function BlogPost({ slug }: { slug: string }) {
  const isCached = useIsCached(cacheKeys.blog.detail(slug));

  if (isCached) {
    console.log('Loading from cache - instant!');
  }

  // ...
}
```

## Best Practices

### 1. Choose Appropriate Cache Times

- **Real-time data**: Use `CACHE_TIMES.REALTIME` or `SHORT`
- **User-generated content**: Use `CACHE_TIMES.SHORT` or `MEDIUM`
- **Published content**: Use `CACHE_TIMES.LONG` or `VERY_LONG`
- **Static content**: Use `CACHE_TIMES.STATIC`

### 2. Always Use Consistent Cache Keys

```typescript
// ✅ Good - using cache key helpers
const queryKey = cacheKeys.blog.detail(slug);

// ❌ Bad - manual string construction
const queryKey = ['blog', slug];
```

### 3. Invalidate Related Caches

```typescript
// When updating a course lesson, invalidate:
await Promise.all([
  cache.invalidateCourse(courseSlug),           // Course detail
  cache.invalidateCourseProgress(userId, courseSlug),  // User progress
  // Optionally invalidate all courses if it affects listings
]);
```

### 4. Prefetch on User Intent

```typescript
// Prefetch on hover for instant navigation
<Link {...createPrefetchHandlers(...)}>
```

### 5. Use Optimistic Updates for Better UX

```typescript
// Update UI immediately, rollback on error
await optimisticUpdate(queryKey, updater, mutationFn);
```

## Performance Tips

1. **Reduce Bundle Size**: Heavy libraries are code-split into separate chunks
2. **Lazy Load**: Use React.lazy() for route components
3. **Prefetch**: Use prefetch handlers on links
4. **Cache Warmup**: Preload critical data on app initialization
5. **Service Worker**: Enables offline mode and faster repeat visits
6. **Code Splitting**: Vite automatically splits code by route

## Troubleshooting

### Cache Not Working?

1. Check if query keys are consistent
2. Verify `staleTime` is set appropriately
3. Check browser DevTools → Application → Cache Storage
4. Use cache monitoring hooks to debug

### Data Not Updating?

1. Ensure proper cache invalidation after mutations
2. Check if `staleTime` is too long
3. Use optimistic updates for instant feedback
4. Consider using `refetchOnWindowFocus: true` for critical data

### Service Worker Issues?

1. Clear browser cache and service workers
2. Check DevTools → Application → Service Workers
3. Unregister old service workers
4. Service worker only works in production builds

## Migration Guide

If you have existing queries, update them to use the new cache system:

### Before
```typescript
const { data } = useSupabaseQuery({
  queryKey: ['blog', slug],
  // ...
});
```

### After
```typescript
import { cacheKeys, CACHE_TIMES } from '@/lib/cache-config';

const { data } = useSupabaseQuery({
  queryKey: cacheKeys.blog.detail(slug),
  staleTime: CACHE_TIMES.MEDIUM, // Optional: override default
  // ...
});
```

## Additional Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
