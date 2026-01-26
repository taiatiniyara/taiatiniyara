# Caching Quick Reference

## Import Statements

```typescript
// Cache configuration
import { cacheKeys, CACHE_TIMES, GC_TIMES } from '@/lib/cache-config';

// Cache hooks
import { 
  useCacheManager, 
  usePrefetch, 
  useOptimisticUpdate,
  useCacheInvalidation,
  useCacheWarmup,
  useIsCached,
  useCacheStats
} from '@/hooks/useCache';

// Cache utilities
import { 
  CacheManager, 
  IndexedDBCache, 
  MemoryCache 
} from '@/lib/cache-utils';
```

## Common Patterns

### 1. Query with Custom Cache Time

```typescript
useSupabaseQuery({
  queryKey: cacheKeys.blog.detail(slug),
  tableName: 'blog_posts',
  params: { name: 'slug', value: slug },
  staleTime: CACHE_TIMES.LONG, // 30 minutes
});
```

### 2. Invalidate Cache After Mutation

```typescript
const cache = useCacheManager();

// After creating/updating/deleting
await cache.invalidateBlog();
await cache.invalidateBlogPost(slug);
await cache.invalidateCourse(courseSlug);
```

### 3. Prefetch on Hover

```typescript
const { createPrefetchHandlers } = usePrefetch();

<Link {...createPrefetchHandlers(
  cacheKeys.blog.detail(slug),
  () => fetchPost(slug),
  CACHE_TIMES.MEDIUM
)}>
  Post Title
</Link>
```

### 4. Optimistic Update

```typescript
const update = useOptimisticUpdate<Post>();

await update(
  cacheKeys.blog.detail(slug),
  (old) => ({ ...old, likes: old.likes + 1 }),
  () => api.likePost(slug)
);
```

### 5. Check if Cached

```typescript
const isCached = useIsCached(cacheKeys.blog.detail(slug));
if (isCached) {
  // Show instant content
}
```

## Cache Times Reference

| Constant | Duration | Use Case |
|----------|----------|----------|
| `CACHE_TIMES.REALTIME` | 0ms | Real-time updates |
| `CACHE_TIMES.SHORT` | 30s | Frequently changing |
| `CACHE_TIMES.MEDIUM` | 5m | Default/Moderate |
| `CACHE_TIMES.LONG` | 30m | Rarely changing |
| `CACHE_TIMES.VERY_LONG` | 1h | Very stable data |
| `CACHE_TIMES.STATIC` | 24h | Static content |

## Cache Keys Quick Lookup

```typescript
// Blog
cacheKeys.blog.all
cacheKeys.blog.lists()
cacheKeys.blog.detail(slug)
cacheKeys.blog.comments(postId)

// Courses
cacheKeys.courses.all
cacheKeys.courses.lists()
cacheKeys.courses.detail(slug)
cacheKeys.courses.lessons(courseSlug)
cacheKeys.courses.lesson(courseSlug, lessonSlug)
cacheKeys.courses.progress(userId, courseSlug)

// Users
cacheKeys.users.all
cacheKeys.users.current()
cacheKeys.users.profile(userId)
cacheKeys.users.enrollments(userId)

// Projects
cacheKeys.projects.all
cacheKeys.projects.lists()
cacheKeys.projects.detail(id)
```

## Cache Manager Methods

```typescript
const cache = useCacheManager();

// Invalidate
cache.invalidateBlog()
cache.invalidateBlogPost(slug)
cache.invalidateBlogComments(postId)
cache.invalidateCourses()
cache.invalidateCourse(slug)
cache.invalidateCourseProgress(userId, courseSlug)
cache.invalidateUserProfile(userId)
cache.invalidateCurrentUser()
cache.invalidateUserEnrollments(userId)

// Manual control
cache.getCachedData(queryKey)
cache.setCacheData(queryKey, data)
cache.removeCache(queryKey)
cache.clearAllCache()
cache.prefetch(queryKey, queryFn, staleTime)
cache.optimisticUpdate(queryKey, updater)
cache.rollback(queryKey, previousData)
```

## Performance Checklist

- [ ] Use appropriate cache times for each query
- [ ] Invalidate related caches after mutations
- [ ] Prefetch data on hover/focus for better UX
- [ ] Use optimistic updates for instant feedback
- [ ] Implement cache warmup for critical data
- [ ] Monitor cache stats in development
- [ ] Use consistent cache keys
- [ ] Enable service worker for offline support

## Debug Commands

```typescript
// Get cache statistics
const getStats = useCacheStats();
console.log(getStats());

// Check if specific data is cached
const isCached = useIsCached(queryKey);

// View all cache data (DevTools)
// Application → Cache Storage
// Application → IndexedDB → app-cache
```
