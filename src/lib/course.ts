import { supabase } from './supabase';
import type {
  Course,
  CourseModule,
  CreateCourseInput,
  UpdateCourseInput,
  CreateModuleInput,
  UpdateModuleInput,
} from '@/types/course';

// ===== COURSES =====

// GET all published courses
export async function getPublishedCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Course[];
}

// GET all courses (including drafts for admin)
export async function getAllCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Course[];
}

// GET featured courses
export async function getFeaturedCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('published_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Course[];
}

// GET single course by slug
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data as Course;
}

// CREATE course
export async function createCourse(input: CreateCourseInput): Promise<Course> {
  const { data, error } = await supabase
    .from('courses')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Course;
}

// UPDATE course
export async function updateCourse(id: string, input: UpdateCourseInput): Promise<Course> {
  const { data, error } = await supabase
    .from('courses')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Course;
}

// DELETE course
export async function deleteCourse(id: string): Promise<void> {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// ===== MODULES =====

// GET modules for a course
export async function getModulesByCourse(courseId: string): Promise<CourseModule[]> {
  const { data, error } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (error) throw new Error(error.message);
  return data as CourseModule[];
}

// GET single module by slug
export async function getModuleBySlug(courseId: string, slug: string): Promise<CourseModule | null> {
  const { data, error } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', courseId)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data as CourseModule;
}

// CREATE module
export async function createModule(input: CreateModuleInput): Promise<CourseModule> {
  const { data, error } = await supabase
    .from('course_modules')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as CourseModule;
}

// UPDATE module
export async function updateModule(id: string, input: UpdateModuleInput): Promise<CourseModule> {
  const { data, error } = await supabase
    .from('course_modules')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as CourseModule;
}

// DELETE module
export async function deleteModule(id: string): Promise<void> {
  const { error } = await supabase
    .from('course_modules')
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
