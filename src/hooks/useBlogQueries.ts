import { useQuery, useMutation, STALE_TIME, queryCache } from '@/lib/supabase-query';
import {
  getPublishedPosts,
  getAllPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getAllTags,
  getPostsByTag,
  searchPosts,
} from '@/lib/blog';
import type { UpdateBlogPostInput } from '@/types/blog';

// Query Keys
export const blogKeys = {
  all: ['blog'] as const,
  posts: () => [...blogKeys.all, 'posts'] as const,
  publishedPosts: (page: number, pageSize: number) => 
    [...blogKeys.posts(), 'published', page, pageSize] as const,
  allPosts: (page: number, pageSize: number) => 
    [...blogKeys.posts(), 'all', page, pageSize] as const,
  post: (slug: string) => [...blogKeys.posts(), 'detail', slug] as const,
  postById: (id: string) => [...blogKeys.posts(), 'detail', 'id', id] as const,
  tags: () => [...blogKeys.all, 'tags'] as const,
  postsByTag: (tag: string, page: number, pageSize: number) => 
    [...blogKeys.posts(), 'tag', tag, page, pageSize] as const,
  search: (query: string, page: number, pageSize: number) => 
    [...blogKeys.posts(), 'search', query, page, pageSize] as const,
};

// Query Hooks

/**
 * Hook to fetch published blog posts with pagination
 */
export const usePublishedPosts = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: blogKeys.publishedPosts(page, pageSize),
    queryFn: () => getPublishedPosts(page, pageSize),
    staleTime: STALE_TIME.MEDIUM,
  });
};

/**
 * Hook to fetch all blog posts (including drafts) with pagination
 */
export const useAllPosts = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: blogKeys.allPosts(page, pageSize),
    queryFn: () => getAllPosts(page, pageSize),
    staleTime: STALE_TIME.SHORT,
  });
};

/**
 * Hook to fetch a single blog post by slug
 */
export const usePostBySlug = (slug: string) => {
  return useQuery({
    queryKey: blogKeys.post(slug),
    queryFn: () => getPostBySlug(slug),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!slug,
  });
};

/**
 * Hook to fetch a single blog post by ID
 */
export const usePostById = (id: string) => {
  return useQuery({
    queryKey: blogKeys.postById(id),
    queryFn: () => getPostById(id),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!id,
  });
};

/**
 * Hook to fetch all tags
 */
export const useAllTags = () => {
  return useQuery({
    queryKey: blogKeys.tags(),
    queryFn: getAllTags,
    staleTime: STALE_TIME.LONG,
  });
};

/**
 * Hook to fetch posts by tag
 */
export const usePostsByTag = (tag: string, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: blogKeys.postsByTag(tag, page, pageSize),
    queryFn: () => getPostsByTag(tag, page, pageSize),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!tag,
  });
};

/**
 * Hook to search posts
 */
export const useSearchPosts = (query: string, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: blogKeys.search(query, page, pageSize),
    queryFn: () => searchPosts(query, page, pageSize),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!query && query.length > 0,
  });
};

// Mutation Hooks

/**
 * Hook to create a new blog post
 */
export const useCreatePost = () => {
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryCache.invalidate('blog');
    },
    invalidateKeys: [blogKeys.posts(), blogKeys.tags()],
  });
};

/**
 * Hook to update a blog post
 */
export const useUpdatePost = () => {
  return useMutation<any, { id: string; input: UpdateBlogPostInput }>({
    mutationFn: ({ id, input }) => updatePost(id, input),
    onSuccess: () => {
      queryCache.invalidate('blog');
    },
    invalidateKeys: [blogKeys.posts(), blogKeys.tags()],
  });
};

/**
 * Hook to delete a blog post
 */
export const useDeletePost = () => {
  return useMutation<void, string>({
    mutationFn: deletePost,
    onSuccess: () => {
      queryCache.invalidate('blog');
    },
    invalidateKeys: [blogKeys.posts(), blogKeys.tags()],
  });
};
