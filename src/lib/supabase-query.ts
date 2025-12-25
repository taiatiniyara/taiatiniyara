import { useState, useEffect, useCallback, useRef } from 'react';

// ==================== TYPE DEFINITIONS ====================

export interface QueryState<TData> {
  data: TData | undefined;
  error: Error | null;
  isPending: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

export interface MutationState<TData, TVariables> {
  data: TData | undefined;
  error: Error | null;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  mutate: (variables: TVariables) => Promise<TData>;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}

// ==================== CACHE MANAGEMENT ====================

interface CacheEntry<TData> {
  data: TData;
  timestamp: number;
  staleTime: number;
}

class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private subscribers = new Map<string, Set<() => void>>();

  get<TData>(key: string): TData | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    const now = Date.now();
    if (now - entry.timestamp > entry.staleTime) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data;
  }

  set<TData>(key: string, data: TData, staleTime: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      staleTime,
    });
    this.notifySubscribers(key);
  }

  invalidate(pattern: string | string[]): void {
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (patterns.some(p => key.includes(p))) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.notifySubscribers(key);
    });
  }

  subscribe(key: string, callback: () => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)!.add(callback);

    return () => {
      const subs = this.subscribers.get(key);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscribers.delete(key);
        }
      }
    };
  }

  private notifySubscribers(key: string): void {
    const subs = this.subscribers.get(key);
    if (subs) {
      subs.forEach(callback => callback());
    }
  }

  clear(): void {
    this.cache.clear();
    this.subscribers.clear();
  }
}

const globalCache = new QueryCache();

// ==================== STALE TIME CONSTANTS ====================

export const STALE_TIME = {
  SHORT: 0,      // No caching
  MEDIUM: 0,     // No caching
  LONG: 0,       // No caching
} as const;

// ==================== QUERY HOOK ====================

export function useQuery<TData>(options: {
  queryKey: readonly (string | number)[] | (string | number)[];
  queryFn: () => Promise<TData>;
  staleTime?: number;
  enabled?: boolean;
}): QueryState<TData> {
  const { queryKey, queryFn, enabled = true } = options;
  const cacheKey = JSON.stringify(queryKey);

  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState<boolean>(enabled);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchedKeyRef = useRef<string | null>(null);

  // Fetch data when query key changes
  useEffect(() => {
    if (!enabled) {
      setIsPending(false);
      return;
    }

    // Only fetch if query key has changed
    if (lastFetchedKeyRef.current === cacheKey) {
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsPending(true);
    setError(null);

    const fetchData = async () => {
      try {
        const result = await queryFn();

        if (isMountedRef.current) {
          setData(result);
          setError(null);
          lastFetchedKeyRef.current = cacheKey;
        }
      } catch (err) {
        if (isMountedRef.current && err instanceof Error && err.name !== 'AbortError') {
          console.error('Query error:', err);
          setError(err instanceof Error ? err : new Error('An error occurred'));
          setData(undefined);
        }
      } finally {
        if (isMountedRef.current) {
          setIsPending(false);
        }
      }
    };

    fetchData();
  }, [cacheKey, enabled, queryFn]);

  // Cache subscription removed - no caching enabled

  // Cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const refetch = useCallback(async () => {
    lastFetchedKeyRef.current = null; // Reset to allow refetch
    setIsPending(true);
    setError(null);

    try {
      const result = await queryFn();

      if (isMountedRef.current) {
        setData(result);
        setError(null);
        lastFetchedKeyRef.current = cacheKey;
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error('Refetch error:', err);
        setError(err instanceof Error ? err : new Error('An error occurred'));
        setData(undefined);
      }
    } finally {
      if (isMountedRef.current) {
        setIsPending(false);
      }
    }
  }, [queryFn, cacheKey]);

  return {
    data,
    error,
    isPending,
    isLoading: isPending,
    isError: error !== null,
    isSuccess: data !== undefined && error === null,
    refetch,
  };
}

// ==================== MUTATION HOOK ====================

export function useMutation<TData, TVariables>(options: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: Error, variables: TVariables) => void;
  invalidateKeys?: readonly (readonly (string | number)[])[] | (string | number)[][];
}): MutationState<TData, TVariables> {
  const { mutationFn, onSuccess, onError, invalidateKeys } = options;

  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(async (variables: TVariables): Promise<TData> => {
    setIsPending(true);
    setError(null);

    try {
      const result = await mutationFn(variables);

      if (isMountedRef.current) {
        setData(result);
        setError(null);

        // Invalidate cache
        if (invalidateKeys) {
          invalidateKeys.forEach(key => {
            globalCache.invalidate(JSON.stringify(key));
          });
        }

        // Call onSuccess callback
        if (onSuccess) {
          await onSuccess(result, variables);
        }
      }

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');

      if (isMountedRef.current) {
        setError(error);
        setData(undefined);

        // Call onError callback
        if (onError) {
          onError(error, variables);
        }
      }

      throw error;
    } finally {
      if (isMountedRef.current) {
        setIsPending(false);
      }
    }
  }, [mutationFn, onSuccess, onError, invalidateKeys]);

  const reset = useCallback(() => {
    setData(undefined);
    setError(null);
    setIsPending(false);
  }, []);

  return {
    data,
    error,
    isPending,
    isError: error !== null,
    isSuccess: data !== undefined && error === null,
    mutate,
    mutateAsync: mutate,
    reset,
  };
}

// ==================== CACHE UTILITIES ====================

export const queryCache = {
  invalidate: (pattern: string | string[]) => globalCache.invalidate(pattern),
  clear: () => globalCache.clear(),
};
