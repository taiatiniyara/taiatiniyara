import { supabase } from './supabase';
import type { BlogPost, CreateBlogPostInput, UpdateBlogPostInput, BlogPostsResponse } from '@/types/blog';

/**
 * Fetch all published blog posts with pagination
 */
export async function getPublishedPosts(page = 1, pageSize = 10): Promise<BlogPostsResponse> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch blog posts: ${error.message}`);
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
  const postData = {
    ...input,
    published_at: input.published && !input.published_at ? new Date().toISOString() : input.published_at,
  };

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(postData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create blog post: ${error.message}`);
  }

  return data as BlogPost;
}

/**
 * Update an existing blog post
 */
export async function updatePost(id: string, input: UpdateBlogPostInput): Promise<BlogPost> {
  const updateData = {
    ...input,
    // If publishing for the first time, set published_at
    ...(input.published && !input.published_at ? { published_at: new Date().toISOString() } : {}),
  };

  const { data, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update blog post: ${error.message}`);
  }

  return data as BlogPost;
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
