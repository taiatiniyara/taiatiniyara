# TanStack Query Utilities Guide

This guide explains how to use the reusable query and mutation utilities to reduce code duplication and simplify debugging.

## Overview

The `src/lib/query-utils.ts` file provides generic factory functions for creating TanStack Query hooks. These utilities eliminate boilerplate code and provide consistent patterns across your application.

## Benefits

✅ **Reduced Code**: ~60% less code compared to manual implementations  
✅ **Type Safety**: Full TypeScript support with proper type inference  
✅ **Consistent Patterns**: Standardized query and mutation configurations  
✅ **Easier Debugging**: Built-in logging capabilities  
✅ **Automatic Cache Invalidation**: Simplified cache management  
✅ **DRY Principle**: No more repetitive useQuery/useMutation setups

## Available Utilities

### Query Factories

#### `createQueryHook`
Creates a standard query hook with optional parameters.

```typescript
// Simple query without parameters
export const useAllTags = createQueryHook({
  queryKey: ['tags'],
  queryFn: getAllTags,
  staleTime: STALE_TIME.LONG,
});

// Query with parameters
export const usePostById = createQueryHook({
  queryKey: (id: string) => ['post', 'id', id],
  queryFn: getPostById,
  staleTime: STALE_TIME.MEDIUM,
  enabled: (id: string) => !!id,
});

// Query with object parameters
export const useEnrollment = createQueryHook({
  queryKey: ({ courseId, userId }: { courseId: string; userId: string }) =>
    ['enrollment', courseId, userId],
  queryFn: ({ courseId, userId }: { courseId: string; userId: string }) =>
    getEnrollment(courseId, userId),
  staleTime: STALE_TIME.SHORT,
  enabled: ({ courseId, userId }: { courseId: string; userId: string }) =>
    !!courseId && !!userId,
});
```

#### `createPaginatedQueryHook`
Creates a query hook with pagination support.

```typescript
export const usePublishedPosts = createPaginatedQueryHook({
  queryKey: (page: number, pageSize: number) => 
    ['posts', 'published', page, pageSize],
  queryFn: getPublishedPosts,
  staleTime: STALE_TIME.MEDIUM,
});

// Usage
const { data, isPending } = usePublishedPosts(1, 10);
```

#### `createSearchQueryHook`
Creates a search query hook with automatic enablement based on query length.

```typescript
export const useSearchPosts = createSearchQueryHook({
  queryKey: (query: string, page: number, pageSize: number) => 
    ['posts', 'search', query, page, pageSize],
  queryFn: searchPosts,
  staleTime: STALE_TIME.MEDIUM,
  minQueryLength: 2, // Only enable when query has 2+ characters
});

// Usage
const { data } = useSearchPosts('react', 1, 10); // Enabled
const { data } = useSearchPosts('r', 1, 10);     // Disabled (too short)
```

### Mutation Factories

#### `createMutationHook`
Creates a mutation hook with automatic cache invalidation and logging.

```typescript
// Simple mutation
export const useCreatePost = createMutationHook({
  mutationFn: createPost,
  invalidateKeys: () => [['posts'], ['tags']],
  enableLogging: true,
});

// Mutation with data-dependent invalidation
export const useUpdatePost = createMutationHook({
  mutationFn: ({ id, input }: { id: string; input: UpdatePostInput }) =>
    updatePost(id, input),
  invalidateKeys: (data) => [
    ['posts'],
    ['post', data.slug],
    ['post', 'id', data.id],
  ],
  enableLogging: true,
});

// Mutation with variable-dependent invalidation
export const useUpdateEnrollment = createMutationHook({
  mutationFn: ({ courseId, userId, input }) =>
    updateEnrollment(courseId, userId, input),
  invalidateKeys: (_, variables) => [
    ['enrollments', variables.userId],
    ['enrollment', variables.courseId, variables.userId],
  ],
});
```

#### `createDeleteMutationHook`
Simplified mutation hook for delete operations.

```typescript
export const useDeletePost = createDeleteMutationHook({
  mutationFn: deletePost,
  invalidateKeys: [['posts'], ['tags']],
  onSuccessCallback: (id) => {
    console.log(`Post ${id} deleted`);
  },
});
```

## Stale Time Constants

Use predefined stale time constants for consistency:

```typescript
import { STALE_TIME } from '@/lib/query-utils';

STALE_TIME.SHORT  // 2 minutes - frequently changing data
STALE_TIME.MEDIUM // 5 minutes - moderately stable data
STALE_TIME.LONG   // 10 minutes - rarely changing data
```

## Migration Examples

### Before (Manual Implementation)

```typescript
export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePostInput) => {
      console.log('Creating post:', input);
      return createPost(input);
    },
    onSuccess: (data) => {
      console.log('Post created:', data);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (error) => {
      console.error('Error creating post:', error);
    },
  });
}
```

### After (Using Utilities)

```typescript
export const usePostBySlug = createQueryHook({
  queryKey: (slug: string) => ['post', slug],
  queryFn: getPostBySlug,
  staleTime: STALE_TIME.MEDIUM,
  enabled: (slug: string) => !!slug,
});

export const useCreatePost = createMutationHook({
  mutationFn: createPost,
  invalidateKeys: () => [['posts'], ['tags']],
  enableLogging: true,
});
```

**Code reduction: 20 lines → 10 lines (50% reduction)**

## Usage in Components

The hooks work exactly the same way as before:

```typescript
import { usePostBySlug, useCreatePost } from '@/hooks/useBlogQueries';

function BlogPost() {
  const { data: post, isPending } = usePostBySlug('my-post');
  const createPost = useCreatePost();

  const handleCreate = () => {
    createPost.mutate({ title: 'New Post', content: '...' });
  };

  if (isPending) return <LoadingSpinner />;
  return <div>{post.title}</div>;
}
```

## Debugging

Enable logging for mutations to track their lifecycle:

```typescript
export const useCreatePost = createMutationHook({
  mutationFn: createPost,
  invalidateKeys: () => [['posts']],
  enableLogging: true, // Logs: variables, success, and errors
});
```

This will output:
```
Mutation called with: { title: 'New Post', ... }
Mutation succeeded: { id: '123', title: 'New Post', ... }
```

## Type Utilities

Extract types from hooks when needed:

```typescript
import type { QueryData, MutationVariables } from '@/lib/query-utils';

// Get the data type returned by a query
type Post = QueryData<ReturnType<typeof usePostBySlug>>;

// Get the variables type for a mutation
type CreatePostVars = MutationVariables<ReturnType<typeof useCreatePost>>;
```

## Best Practices

1. **Use appropriate factories**: Choose the right factory for your use case
2. **Consistent naming**: Follow the `use[Entity][Action]` pattern
3. **Proper stale times**: Use constants based on data volatility
4. **Enable logging**: Use `enableLogging: true` during development
5. **Type safety**: Let TypeScript infer types when possible
6. **Cache invalidation**: Be specific about which queries to invalidate

## Performance Benefits

- **Smaller bundle size**: Less duplicated code
- **Better tree shaking**: Factory functions are more optimizable
- **Reduced memory**: Shared logic across hooks
- **Faster development**: Less boilerplate to write and maintain

## Migration Checklist

When refactoring existing query hooks:

- [ ] Import factory functions from `@/lib/query-utils`
- [ ] Replace `function` declarations with `const` exports
- [ ] Use appropriate factory (`createQueryHook`, `createPaginatedQueryHook`, etc.)
- [ ] Remove manual `useQuery`/`useMutation` calls
- [ ] Replace hardcoded stale times with `STALE_TIME` constants
- [ ] Use `enableLogging: true` for mutations during development
- [ ] Simplify cache invalidation logic
- [ ] Test thoroughly to ensure behavior is unchanged

## Summary

The query utilities provide a powerful abstraction that:
- Reduces code by ~50-60%
- Improves maintainability
- Ensures consistency
- Simplifies debugging
- Maintains full type safety
- Makes the codebase easier to understand and extend

For questions or issues, refer to the implementation in:
- `src/lib/query-utils.ts` - Factory functions
- `src/hooks/useBlogQueries.ts` - Simple example
- `src/hooks/useCourseQueries.ts` - Complex example with multiple entity types
