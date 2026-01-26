import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";
import { CacheManager } from "@/lib/cache-utils";

/**
 * Hook to access cache manager utilities
 */
export function useCacheManager() {
  const queryClient = useQueryClient();
  
  const cacheManager = useMemo(
    () => new CacheManager(queryClient),
    [queryClient]
  );

  return cacheManager;
}

/**
 * Hook for prefetching data on hover or focus
 */
export function usePrefetch() {
  const queryClient = useQueryClient();

  const prefetch = useCallback(
    (queryKey: readonly any[] | any[], queryFn: () => Promise<any>, staleTime?: number) => {
      queryClient.prefetchQuery({
        queryKey: queryKey as any[],
        queryFn,
        staleTime,
      });
    },
    [queryClient]
  );

  /**
   * Create hover handlers for prefetching
   */
  const createPrefetchHandlers = useCallback(
    (queryKey: readonly any[] | any[], queryFn: () => Promise<any>, staleTime?: number) => ({
      onMouseEnter: () => prefetch(queryKey, queryFn, staleTime),
      onFocus: () => prefetch(queryKey, queryFn, staleTime),
    }),
    [prefetch]
  );

  return { prefetch, createPrefetchHandlers };
}

/**
 * Hook for optimistic updates with automatic rollback on error
 */
export function useOptimisticUpdate<T>() {
  const queryClient = useQueryClient();

  const update = useCallback(
    async (
      queryKey: readonly any[] | any[],
      updater: (old: T | undefined) => T,
      mutationFn: () => Promise<any>
    ) => {
      const key = queryKey as any[];
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: key });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<T>(key);

      // Optimistically update to the new value
      queryClient.setQueryData(key, updater);

      try {
        // Perform the mutation
        await mutationFn();
        return { success: true };
      } catch (error) {
        // Rollback on error
        queryClient.setQueryData(key, previousData);
        return { success: false, error };
      } finally {
        // Refetch to ensure we have the latest data
        queryClient.invalidateQueries({ queryKey: key });
      }
    },
    [queryClient]
  );

  return update;
}

/**
 * Hook for cache invalidation with debouncing
 */
export function useCacheInvalidation() {
  const cacheManager = useCacheManager();
  const timeouts = useMemo(() => new Map<string, NodeJS.Timeout>(), []);

  const invalidate = useCallback(
    (queryKey: readonly any[] | any[], delay = 0) => {
      const key = JSON.stringify(queryKey);
      
      // Clear existing timeout if any
      if (timeouts.has(key)) {
        clearTimeout(timeouts.get(key));
      }

      // Set new timeout
      const timeout = setTimeout(() => {
        cacheManager.removeCache(queryKey);
        timeouts.delete(key);
      }, delay);

      timeouts.set(key, timeout);
    },
    [cacheManager, timeouts]
  );

  return invalidate;
}

/**
 * Hook for cache warmup - preload critical data
 */
export function useCacheWarmup() {
  const { prefetch } = usePrefetch();

  const warmup = useCallback(
    (queries: Array<{ queryKey: readonly any[] | any[]; queryFn: () => Promise<any>; staleTime?: number }>) => {
      queries.forEach(({ queryKey, queryFn, staleTime }) => {
        prefetch(queryKey, queryFn, staleTime);
      });
    },
    [prefetch]
  );

  return warmup;
}

/**
 * Hook to check if data is cached
 */
export function useIsCached(queryKey: readonly any[] | any[]) {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(queryKey as any[]);
  return data !== undefined;
}

/**
 * Hook to get cache statistics
 */
export function useCacheStats() {
  const queryClient = useQueryClient();

  const getStats = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    const stats = {
      total: queries.length,
      active: queries.filter(q => q.state.fetchStatus !== 'idle').length,
      stale: queries.filter(q => q.isStale()).length,
      fresh: queries.filter(q => !q.isStale()).length,
      error: queries.filter(q => q.state.status === 'error').length,
      success: queries.filter(q => q.state.status === 'success').length,
    };

    return stats;
  }, [queryClient]);

  return getStats;
}
