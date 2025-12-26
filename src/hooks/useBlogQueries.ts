import { useState, useEffect } from 'react';
import type { BlogPost, CreateBlogPostInput, UpdateBlogPostInput } from '@/types/blog';
import { 
  getAllPosts,
  getPublishedPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '@/lib/blog';

// Hook to fetch all posts (including drafts for admin)
export function useAllPosts(page: number = 1, limit: number = 100) {
  const [data, setData] = useState<{ posts: BlogPost[] }>({ posts: [] });
  const [isPending, setIsPending] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setIsPending(true);
        setIsError(false);
        setError(null);

        const posts = await getAllPosts();
        
        if (!isMounted) return;
        
        setData({ posts });
      } catch (err) {
        if (!isMounted) return;
        
        setIsError(true);
        setError(err as Error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsPending(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [page, limit]);

  return {
    data,
    isPending,
    isLoading,
    isError,
    error,
  };
}

// Hook to fetch published posts only
export function usePublishedPosts() {
  const [data, setData] = useState<{ posts: BlogPost[] }>({ posts: [] });
  const [isPending, setIsPending] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setIsPending(true);
        setIsError(false);
        setError(null);

        const posts = await getPublishedPosts();
        
        if (!isMounted) return;
        
        setData({ posts });
      } catch (err) {
        if (!isMounted) return;
        
        setIsError(true);
        setError(err as Error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsPending(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    isPending,
    isLoading,
    isError,
    error,
  };
}

// Hook to fetch a single post by slug
export function usePost(slug: string) {
  const [data, setData] = useState<BlogPost | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setIsPending(true);
        setIsError(false);
        setError(null);

        const post = await getPostBySlug(slug);
        
        if (!isMounted) return;
        
        setData(post);
      } catch (err) {
        if (!isMounted) return;
        
        setIsError(true);
        setError(err as Error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsPending(false);
        }
      }
    };

    if (slug) {
      fetchPost();
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return {
    data,
    isPending,
    isLoading,
    isError,
    error,
  };
}

export function useCreatePost() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async (input: CreateBlogPostInput) => {
    setIsPending(true);
    setError(null);
    try {
      const result = await createPost(input);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const mutate = (input: CreateBlogPostInput) => {
    mutateAsync(input).catch(console.error);
  };

  return { 
    mutate,
    mutateAsync,
    isPending,
    error,
  };
}

export function useUpdatePost() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async ({ id, input }: { id: string; input: UpdateBlogPostInput }) => {
    setIsPending(true);
    setError(null);
    try {
      const result = await updatePost(id, input);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const mutate = ({ id, input }: { id: string; input: UpdateBlogPostInput }) => {
    mutateAsync({ id, input }).catch(console.error);
  };

  return { 
    mutate,
    mutateAsync,
    isPending,
    error,
  };
}

export function useDeletePost() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async (id: string) => {
    setIsPending(true);
    setError(null);
    try {
      await deletePost(id);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const mutate = (id: string) => {
    mutateAsync(id).catch(console.error);
  };

  return { 
    mutate,
    mutateAsync,
    isPending,
    error,
  };
}

export function useBlogQueries() {
  // Implementation placeholder
  return {};
}
