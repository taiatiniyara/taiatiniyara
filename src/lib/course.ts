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
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching published courses:', error);
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }
  
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

// ===== ENROLLMENTS =====

// ENROLL user in a course
export async function enrollInCourse(courseId: string, userId: string, userEmail: string): Promise<void> {
  const { error } = await supabase
    .from('course_enrollments')
    .upsert({
      course_id: courseId,
      user_id: userId,
      user_email: userEmail,
      enrolled_at: new Date().toISOString(),
      progress: 0,
    }, {
      onConflict: 'course_id,user_id'
    });

  if (error) throw new Error(error.message);
}

// CHECK if user is enrolled in a course
export async function isUserEnrolled(courseId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('course_id', courseId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return !!data;
}

// GET user enrollments
export async function getUserEnrollments(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('course_enrollments')
    .select('*')
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// UPDATE course progress
export async function updateCourseProgress(
  courseId: string,
  userId: string,
  progress: number
): Promise<void> {
  const { error } = await supabase
    .from('course_enrollments')
    .update({ 
      progress,
      completed_at: progress === 100 ? new Date().toISOString() : null
    })
    .eq('course_id', courseId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
}

// MARK module as complete
export async function markModuleComplete(
  moduleId: string,
  courseId: string,
  userId: string,
  userEmail: string
): Promise<void> {
  const { error } = await supabase
    .from('module_completions')
    .upsert({
      user_id: userId,
      user_email: userEmail,
      course_id: courseId,
      module_id: moduleId,
      completed_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,module_id'
    });

  if (error) throw new Error(error.message);
}

// UNMARK module as complete
export async function unmarkModuleComplete(moduleId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('module_completions')
    .delete()
    .eq('module_id', moduleId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
}

// GET completed modules for a course
export async function getCompletedModules(courseId: string, userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('module_completions')
    .select('module_id')
    .eq('course_id', courseId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data ? data.map(item => item.module_id) : [];
}

// GET enrollment with progress
export async function getEnrollmentProgress(courseId: string, userId: string): Promise<any> {
  const { data, error } = await supabase
    .from('course_enrollments')
    .select('*')
    .eq('course_id', courseId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
