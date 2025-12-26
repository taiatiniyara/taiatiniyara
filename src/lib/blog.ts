import { supabase } from './supabase';
import type { BlogPost, CreateBlogPostInput, UpdateBlogPostInput } from '@/types/blog';

// GET all published posts
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching published posts:', error);
    throw new Error(`Failed to fetch blog posts: ${error.message}`);
  }
  return data as BlogPost[];
}

// GET all posts (including drafts for admin)
export async function getAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as BlogPost[];
}

// GET single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data as BlogPost;
}

// CREATE post
export async function createPost(input: CreateBlogPostInput): Promise<BlogPost> {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as BlogPost;
}

// UPDATE post
export async function updatePost(id: string, input: UpdateBlogPostInput): Promise<BlogPost> {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as BlogPost;
}

// DELETE post
export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// Generate slug helper
export function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomString}`;
}

