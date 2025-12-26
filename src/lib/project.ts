import { supabase } from './supabase';
import type { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project';

// GET all published projects
export async function getPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching published projects:', error);
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }
  return data as Project[];
}

// GET all projects (including drafts for admin)
export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Project[];
}

// GET featured projects
export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('published_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Project[];
}

// GET single project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data as Project;
}

// CREATE project
export async function createProject(input: CreateProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Project;
}

// UPDATE project
export async function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Project;
}

// DELETE project
export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
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

