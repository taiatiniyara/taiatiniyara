import { supabase } from './supabase';
import type { BlogPost, CreateBlogPostInput, UpdateBlogPostInput, BlogPostsResponse } from '@/types/blog';

/**
 * Fetch all published blog posts with pagination
 */
export async function getPublishedPosts(page = 1, pageSize = 10): Promise<BlogPostsResponse> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  console.log('Fetching published posts', { page, pageSize, from, to });

  const { data, error, count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching published posts:', error);
    throw new Error(`Failed to fetch blog posts: ${error.message}`);
  }

  console.log('Successfully fetched published posts', { count: data?.length, total: count });

  return {
    posts: data as BlogPost[],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

/**
 * Fetch all blog posts (published and drafts) with pagination
 */
export async function getAllPosts(page = 1, pageSize = 10): Promise<BlogPostsResponse> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch all blog posts: ${error.message}`);
  }

  return {
    posts: data as BlogPost[],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

/**
 * Fetch a single blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Post not found
    }
    throw new Error(`Failed to fetch blog post: ${error.message}`);
  }

  return data as BlogPost;
}

/**
 * Fetch a single blog post by ID
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Post not found
    }
    throw new Error(`Failed to fetch blog post: ${error.message}`);
  }

  return data as BlogPost;
}

/**
 * Create a new blog post
 */
export async function createPost(input: CreateBlogPostInput): Promise<BlogPost> {
  const requestStartTime = Date.now();
  console.log('createPost called');
  console.log('Content length:', input.content.length, 'characters');
  console.log('Approximate payload size:', new Blob([JSON.stringify(input)]).size, 'bytes');
  
  // Check Supabase connection and auth
  console.log('Checking Supabase connection...');
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Current session:', session ? 'Authenticated' : 'No session (public access)');
  
  const postData = {
    ...input,
    published_at: input.published && !input.published_at ? new Date().toISOString() : input.published_at,
  };

  console.log('Sending INSERT request to Supabase blog_posts table...');
  const insertStartTime = Date.now();

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single();

    const insertDuration = Date.now() - insertStartTime;
    const totalDuration = Date.now() - requestStartTime;
    console.log('Supabase INSERT completed in', insertDuration, 'ms (total:', totalDuration, 'ms)');

    if (error) {
      console.error('createPost - Supabase error:', error);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      throw new Error(`Failed to create blog post: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from Supabase');
    }

    console.log('createPost - Success, post ID:', data?.id);
    return data as BlogPost;
  } catch (error) {
    const duration = Date.now() - requestStartTime;
    console.error('createPost - Exception after', duration, 'ms');
    console.error('Exception type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Exception details:', error);
    throw error;
  }
}

/**
 * Update an existing blog post
 */
export async function updatePost(id: string, input: UpdateBlogPostInput): Promise<BlogPost> {
  console.log('updatePost called with id:', id);
  console.log('Content length:', input.content?.length || 0, 'characters');
  
  const updateData = {
    ...input,
    // If publishing for the first time, set published_at
    ...(input.published && !input.published_at ? { published_at: new Date().toISOString() } : {}),
  };

  console.log('updatePost - updating post (content truncated)');

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('updatePost - Supabase error:', error);
      throw new Error(`Failed to update blog post: ${error.message}`);
    }

    console.log('updatePost - Success, data returned:', data?.id);
    return data as BlogPost;
  } catch (error) {
    console.error('updatePost - Caught exception:', error);
    throw error;
  }
}

/**
 * Delete a blog post
 */
export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete blog post: ${error.message}`);
  }
}

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Generate random 6-character string
  const randomString = Math.random().toString(36).substring(2, 8);
  
  return `${baseSlug}-${randomString}`;
}

/**
 * Search blog posts by title or content
 */
export async function searchPosts(query: string, page = 1, pageSize = 10): Promise<BlogPostsResponse> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to search blog posts: ${error.message}`);
  }

  return {
    posts: data as BlogPost[],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string, page = 1, pageSize = 10): Promise<BlogPostsResponse> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .contains('tags', [tag])
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch posts by tag: ${error.message}`);
  }

  return {
    posts: data as BlogPost[],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

/**
 * Get all unique tags from published posts
 */
export async function getAllTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('tags')
    .eq('published', true);

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  const allTags = data.flatMap((post) => post.tags || []);
  return Array.from(new Set(allTags)).sort();
}
