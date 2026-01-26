import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

// Cache time constants (in milliseconds)
export const CACHE_TIMES = {
  // Very frequently changing data (real-time updates)
  REALTIME: 0,
  
  // Frequently changing data (user interactions, comments)
  SHORT: 1000 * 30, // 30 seconds
  
  // Moderately changing data (blog posts, courses)
  MEDIUM: 1000 * 60 * 5, // 5 minutes
  
  // Rarely changing data (user profiles, static content)
  LONG: 1000 * 60 * 30, // 30 minutes
  
  // Very rarely changing data (configuration, categories)
  VERY_LONG: 1000 * 60 * 60, // 1 hour
  
  // Static data (terms of service, about page)
  STATIC: 1000 * 60 * 60 * 24, // 24 hours
} as const;

// Garbage collection times (how long to keep unused data in cache)
export const GC_TIMES = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 30, // 30 minutes
  LONG: 1000 * 60 * 60 * 2, // 2 hours
  VERY_LONG: 1000 * 60 * 60 * 24, // 24 hours
} as const;

/**
 * Create an optimized QueryClient with advanced caching configuration
 */
export function createOptimizedQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Default stale time - data is considered fresh for 5 minutes
        staleTime: CACHE_TIMES.MEDIUM,
        
        // Garbage collection time - unused data removed after 30 minutes
        gcTime: GC_TIMES.MEDIUM,
        
        // Don't refetch on window focus by default (can be overridden per query)
        refetchOnWindowFocus: false,
        
        // Don't refetch on reconnect by default
        refetchOnReconnect: false,
        
        // Don't refetch on component mount if data is fresh
        refetchOnMount: false,
        
        // Retry failed requests with exponential backoff
        retry: (failureCount, error: any) => {
          // Don't retry on 404s or auth errors
          if (error?.status === 404 || error?.status === 401 || error?.status === 403) {
            return false;
          }
          // Retry up to 2 times for other errors
          return failureCount < 2;
        },
        
        // Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Retry mutations once on network errors
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
}

/**
 * Create a persister for offline cache storage using IndexedDB
 */
export function createCachePersister() {
  if (typeof window === 'undefined') return null;
  
  return createSyncStoragePersister({
    storage: window.localStorage,
    // Only persist queries that have been successful
    serialize: (data) => JSON.stringify(data),
    deserialize: (data) => JSON.parse(data),
  });
}

/**
 * Setup persistent caching with IndexedDB fallback to localStorage
 */
export function setupPersistentCache(queryClient: QueryClient) {
  if (typeof window === 'undefined') return;
  
  const persister = createCachePersister();
  
  if (persister) {
    persistQueryClient({
      queryClient,
      persister,
      maxAge: GC_TIMES.VERY_LONG, // Keep cache for 24 hours
      dehydrateOptions: {
        // Only persist successful queries
        shouldDehydrateQuery: (query) => {
          return query.state.status === 'success';
        },
      },
    });
  }
}

/**
 * Cache key generators for consistent cache keys across the app
 */
export const cacheKeys = {
  // Blog related
  blog: {
    all: ['blog'] as const,
    lists: () => [...cacheKeys.blog.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...cacheKeys.blog.lists(), filters] as const,
    details: () => [...cacheKeys.blog.all, 'detail'] as const,
    detail: (slug: string) => [...cacheKeys.blog.details(), slug] as const,
    comments: (postId: string) => [...cacheKeys.blog.detail(postId), 'comments'] as const,
  },
  
  // Course related
  courses: {
    all: ['courses'] as const,
    lists: () => [...cacheKeys.courses.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...cacheKeys.courses.lists(), filters] as const,
    details: () => [...cacheKeys.courses.all, 'detail'] as const,
    detail: (slug: string) => [...cacheKeys.courses.details(), slug] as const,
    lessons: (courseSlug: string) => [...cacheKeys.courses.detail(courseSlug), 'lessons'] as const,
    lesson: (courseSlug: string, lessonSlug: string) => 
      [...cacheKeys.courses.lessons(courseSlug), lessonSlug] as const,
    progress: (userId: string, courseSlug: string) => 
      [...cacheKeys.courses.detail(courseSlug), 'progress', userId] as const,
  },
  
  // User related
  users: {
    all: ['users'] as const,
    profile: (userId: string) => [...cacheKeys.users.all, 'profile', userId] as const,
    current: () => [...cacheKeys.users.all, 'current'] as const,
    enrollments: (userId: string) => [...cacheKeys.users.all, 'enrollments', userId] as const,
  },
  
  // Projects
  projects: {
    all: ['projects'] as const,
    lists: () => [...cacheKeys.projects.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...cacheKeys.projects.lists(), filters] as const,
    detail: (id: string) => [...cacheKeys.projects.all, 'detail', id] as const,
  },
} as const;

/**
 * Prefetch strategies for common navigation patterns
 */
export const prefetchStrategies = {
  // Prefetch blog post when hovering over link
  blogPost: (queryClient: QueryClient, slug: string, fetchFn: () => Promise<any>) => {
    queryClient.prefetchQuery({
      queryKey: cacheKeys.blog.detail(slug),
      queryFn: fetchFn,
      staleTime: CACHE_TIMES.MEDIUM,
    });
  },
  
  // Prefetch course when hovering over link
  course: (queryClient: QueryClient, slug: string, fetchFn: () => Promise<any>) => {
    queryClient.prefetchQuery({
      queryKey: cacheKeys.courses.detail(slug),
      queryFn: fetchFn,
      staleTime: CACHE_TIMES.LONG,
    });
  },
  
  // Prefetch next lesson in a course
  nextLesson: (queryClient: QueryClient, courseSlug: string, lessonSlug: string, fetchFn: () => Promise<any>) => {
    queryClient.prefetchQuery({
      queryKey: cacheKeys.courses.lesson(courseSlug, lessonSlug),
      queryFn: fetchFn,
      staleTime: CACHE_TIMES.LONG,
    });
  },
};
