import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import type { CreateBlogPostInput, UpdateBlogPostInput } from '@/types/blog';

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
export function usePublishedPosts(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: blogKeys.publishedPosts(page, pageSize),
    queryFn: () => getPublishedPosts(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all blog posts (including drafts) with pagination
 */
export function useAllPosts(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: blogKeys.allPosts(page, pageSize),
    queryFn: () => getAllPosts(page, pageSize),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch a single blog post by slug
 */
export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: blogKeys.post(slug),
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single blog post by ID
 */
export function usePostById(id: string) {
  return useQuery({
    queryKey: blogKeys.postById(id),
    queryFn: () => getPostById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all tags
 */
export function useAllTags() {
  return useQuery({
    queryKey: blogKeys.tags(),
    queryFn: getAllTags,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch posts by tag
 */
export function usePostsByTag(tag: string | null, page = 1, pageSize = 10) {
  return useQuery({
    queryKey: blogKeys.postsByTag(tag || '', page, pageSize),
    queryFn: () => getPostsByTag(tag!, page, pageSize),
    enabled: !!tag,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to search posts
 */
export function useSearchPosts(query: string, page = 1, pageSize = 10) {
  return useQuery({
    queryKey: blogKeys.search(query, page, pageSize),
    queryFn: () => searchPosts(query, page, pageSize),
    enabled: !!query && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutation Hooks

/**
 * Hook to create a new blog post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBlogPostInput) => {
      console.log('useCreatePost mutationFn called with:', input);
      return createPost(input);
    },
    onSuccess: (data) => {
      console.log('Blog post created successfully:', data);
      // Invalidate all post lists to refetch
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });
      queryClient.invalidateQueries({ queryKey: blogKeys.tags() });
    },
    onError: (error) => {
      console.error('Error in useCreatePost mutation:', error);
    },
  });
}

/**
 * Hook to update a blog post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBlogPostInput }) => {
      console.log('useUpdatePost mutationFn called with:', id, input);
      return updatePost(id, input);
    },
    onSuccess: (data) => {
      console.log('Blog post updated successfully:', data);
      // Invalidate all post lists and the specific post
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });
      queryClient.invalidateQueries({ queryKey: blogKeys.post(data.slug) });
      queryClient.invalidateQueries({ queryKey: blogKeys.postById(data.id) });
      queryClient.invalidateQueries({ queryKey: blogKeys.tags() });
    },
    onError: (error) => {
      console.error('Error in useUpdatePost mutation:', error);
    },
  });
}

/**
 * Hook to delete a blog post
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      // Invalidate all post lists
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });
      queryClient.invalidateQueries({ queryKey: blogKeys.tags() });
    },
  });
}
