import { QueryClient } from "@tanstack/react-query";
import { cacheKeys } from "./cache-config";

/**
 * Cache invalidation utilities
 */
export class CacheManager {
  private queryClient: QueryClient;
  
  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Invalidate all blog-related cache
   */
  invalidateBlog() {
    return this.queryClient.invalidateQueries({
      queryKey: cacheKeys.blog.all,
    });
  }

  /**
   * Invalidate specific blog post cache
   */
  invalidateBlogPost(slug: string) {
    return this.queryClient.invalidateQueries({
      queryKey: cacheKeys.blog.detail(slug),
    });
  }

  /**
   * Invalidate blog post comments
   */
  invalidateBlogComments(postId: string) {
    return this.queryClient.invalidateQueries({
      queryKey: cacheKeys.blog.comments(postId),
    });
  }

  /**
   * Invalidate all course-related cache
   */
  invalidateCourses() {
    return this.queryClient.invalidateQueries({
      queryKey: cacheKeys.courses.all,
    });
  }

  /**
   * Invalidate specific course cache
   */
  invalidateCourse(slug: string) {
    return this.queryClient.invalidateQueries({
      queryKey: cacheKeys.courses.detail(slug),
    });
  }

  /**
   * Invalidate course progress for a user
   */
  invalidateCourseProgress(userId: string, courseSlug: string) {
    return this.queryClient.invalidateQueries({
      queryKey: cacheKeys.courses.progress(userId, courseSlug),
    });
  }

  /**
   * Invalidate user profile cache
   */
  invalidateUserProfile(userId: string) {
    return this.queryClient.invalidateQueries({
      queryKey: cacheKeys.users.profile(userId),
    });
  }

  /**
   * Invalidate current user cache
   */
  invalidateCurrentUser() {
    return this.queryClient.invalidateQueries({
      queryKey: cacheKeys.users.current(),
    });
  }

  /**
   * Invalidate user enrollments
   */
  invalidateUserEnrollments(userId: string) {
    return this.queryClient.invalidateQueries({
      queryKey: cacheKeys.users.enrollments(userId),
    });
  }

  /**
   * Clear all cache data
   */
  clearAllCache() {
    return this.queryClient.clear();
  }

  /**
   * Remove specific cache entries by query key
   */
  removeCache(queryKey: readonly any[] | any[]) {
    return this.queryClient.removeQueries({ queryKey: queryKey as any[] });
  }

  /**
   * Prefetch data for faster navigation
   */
  prefetch(queryKey: readonly any[] | any[], queryFn: () => Promise<any>, staleTime?: number) {
    return this.queryClient.prefetchQuery({
      queryKey: queryKey as any[],
      queryFn,
      staleTime,
    });
  }

  /**
   * Get cached data without triggering a fetch
   */
  getCachedData<T>(queryKey: readonly any[] | any[]): T | undefined {
    return this.queryClient.getQueryData<T>(queryKey as any[]);
  }

  /**
   * Set cache data manually
   */
  setCacheData<T>(queryKey: readonly any[] | any[], data: T) {
    this.queryClient.setQueryData(queryKey as any[], data);
  }

  /**
   * Optimistically update cache (useful for mutations)
   */
  optimisticUpdate<T>(
    queryKey: readonly any[] | any[],
    updater: (old: T | undefined) => T
  ) {
    const previousData = this.queryClient.getQueryData<T>(queryKey as any[]);
    this.queryClient.setQueryData(queryKey as any[], updater);
    return previousData;
  }

  /**
   * Rollback optimistic update
   */
  rollback<T>(queryKey: readonly any[] | any[], previousData: T | undefined) {
    this.queryClient.setQueryData(queryKey as any[], previousData);
  }
}

/**
 * IndexedDB cache utilities for offline storage
 */
export class IndexedDBCache {
  private dbName = 'app-cache';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init() {
    if (typeof window === 'undefined') return;
    
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores for different data types
        if (!db.objectStoreNames.contains('blog')) {
          db.createObjectStore('blog', { keyPath: 'slug' });
        }
        if (!db.objectStoreNames.contains('courses')) {
          db.createObjectStore('courses', { keyPath: 'slug' });
        }
        if (!db.objectStoreNames.contains('assets')) {
          db.createObjectStore('assets', { keyPath: 'url' });
        }
      };
    });
  }

  async set(storeName: string, _key: string, value: any) {
    if (!this.db) await this.init();
    if (!this.db) return;

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({ ...value, _cachedAt: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) await this.init();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const data = request.result;
        // Check if cached data is still valid (within 24 hours)
        if (data && Date.now() - data._cachedAt < 24 * 60 * 60 * 1000) {
          resolve(data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, key: string) {
    if (!this.db) await this.init();
    if (!this.db) return;

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string) {
    if (!this.db) await this.init();
    if (!this.db) return;

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

/**
 * Memory cache for frequently accessed data
 */
export class MemoryCache<T = any> {
  private cache = new Map<string, { data: T; expiry: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: T, ttl?: number) {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expiry });
  }

  get(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * HTTP Cache utilities for static assets
 */
export const httpCache = {
  /**
   * Cache-Control header for different asset types
   */
  headers: {
    immutable: 'public, max-age=31536000, immutable', // 1 year for hashed assets
    longTerm: 'public, max-age=604800, must-revalidate', // 1 week
    mediumTerm: 'public, max-age=3600, must-revalidate', // 1 hour
    shortTerm: 'public, max-age=300, must-revalidate', // 5 minutes
    noCache: 'no-cache, no-store, must-revalidate',
  },

  /**
   * Get appropriate cache header for file type
   */
  getHeaderForFile(filename: string): string {
    // Hashed assets (contains hash in filename)
    if (/\.[a-f0-9]{8}\.(js|css|png|jpg|jpeg|gif|svg|woff2?)$/i.test(filename)) {
      return this.headers.immutable;
    }

    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'js':
      case 'css':
        return this.headers.longTerm;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
      case 'webp':
      case 'woff':
      case 'woff2':
      case 'ttf':
        return this.headers.longTerm;
      case 'html':
        return this.headers.shortTerm;
      default:
        return this.headers.mediumTerm;
    }
  },
};
