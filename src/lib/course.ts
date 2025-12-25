import { supabase } from './supabase';
import type {
  Course,
  CourseWithModules,
  CourseModule,
  CourseEnrollment,
  CreateCourseInput,
  UpdateCourseInput,
  CreateModuleInput,
  UpdateModuleInput,
  CoursesResponse,
  EnrollmentInput,
  UpdateEnrollmentInput,
} from '@/types/course';

// ============ COURSE OPERATIONS ============

/**
 * Fetch all published courses with pagination
 */
export async function getPublishedCourses(page = 1, pageSize = 10): Promise<CoursesResponse> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('courses')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }

  return {
    courses: data as Course[],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

/**
 * Fetch all courses (published and drafts) with pagination
 */
export async function getAllCourses(page = 1, pageSize = 10): Promise<CoursesResponse> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('courses')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch all courses: ${error.message}`);
  }

  return {
    courses: data as Course[],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

/**
 * Fetch featured courses
 */
export async function getFeaturedCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('published_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch featured courses: ${error.message}`);
  }

  return data as Course[];
}

/**
 * Fetch a single course by slug with modules
 */
export async function getCourseBySlug(slug: string): Promise<CourseWithModules | null> {
  // Fetch the course
  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (courseError) {
    if (courseError.code === 'PGRST116') {
      return null; // Course not found
    }
    throw new Error(`Failed to fetch course: ${courseError.message}`);
  }

  // Fetch modules for this course
  const { data: modulesData, error: modulesError } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', courseData.id)
    .order('order_index', { ascending: true });

  if (modulesError) {
    throw new Error(`Failed to fetch modules: ${modulesError.message}`);
  }

  const modules = (modulesData || []) as CourseModule[];
  const totalDuration = modules.reduce((sum, module) => sum + module.duration_minutes, 0);

  return {
    ...(courseData as Course),
    modules,
    total_modules: modules.length,
    total_duration_minutes: totalDuration,
  };
}

/**
 * Fetch a single course by ID
 */
export async function getCourseById(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Course not found
    }
    throw new Error(`Failed to fetch course: ${error.message}`);
  }

  return data as Course;
}

/**
 * Create a new course
 */
export async function createCourse(input: CreateCourseInput): Promise<Course> {
  const { data, error } = await supabase
    .from('courses')
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create course: ${error.message}`);
  }

  return data as Course;
}

/**
 * Update a course
 */
export async function updateCourse(id: string, input: UpdateCourseInput): Promise<Course> {
  const { data, error } = await supabase
    .from('courses')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update course: ${error.message}`);
  }

  return data as Course;
}

/**
 * Delete a course
 */
export async function deleteCourse(id: string): Promise<void> {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete course: ${error.message}`);
  }
}

/**
 * Search courses by title or description
 */
export async function searchCourses(
  query: string,
  page = 1,
  pageSize = 10
): Promise<CoursesResponse> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('courses')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to search courses: ${error.message}`);
  }

  return {
    courses: data as Course[],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

/**
 * Get courses by category
 */
export async function getCoursesByCategory(category: string): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('published_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch courses by category: ${error.message}`);
  }

  return data as Course[];
}

/**
 * Get courses by level
 */
export async function getCoursesByLevel(level: 'beginner' | 'intermediate' | 'advanced'): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .eq('level', level)
    .order('published_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch courses by level: ${error.message}`);
  }

  return data as Course[];
}

// ============ COURSE MODULE OPERATIONS ============

/**
 * Fetch modules for a specific course
 */
export async function getModulesByCourse(courseId: string): Promise<CourseModule[]> {
  const { data, error } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch modules: ${error.message}`);
  }

  return data as CourseModule[];
}

/**
 * Fetch a single module by ID
 */
export async function getModuleById(id: string): Promise<CourseModule | null> {
  const { data, error } = await supabase
    .from('course_modules')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch module: ${error.message}`);
  }

  return data as CourseModule;
}

/**
 * Fetch a module by course and slug
 */
export async function getModuleBySlug(courseId: string, slug: string): Promise<CourseModule | null> {
  const { data, error } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', courseId)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch module: ${error.message}`);
  }

  return data as CourseModule;
}

/**
 * Create a new module
 */
export async function createModule(input: CreateModuleInput): Promise<CourseModule> {
  const { data, error } = await supabase
    .from('course_modules')
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create module: ${error.message}`);
  }

  return data as CourseModule;
}

/**
 * Update a module
 */
export async function updateModule(id: string, input: UpdateModuleInput): Promise<CourseModule> {
  const { data, error } = await supabase
    .from('course_modules')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update module: ${error.message}`);
  }

  return data as CourseModule;
}

/**
 * Delete a module
 */
export async function deleteModule(id: string): Promise<void> {
  const { error } = await supabase
    .from('course_modules')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete module: ${error.message}`);
  }
}

// ============ ENROLLMENT OPERATIONS ============

/**
 * Enroll a user in a course
 */
export async function enrollInCourse(input: EnrollmentInput): Promise<CourseEnrollment> {
  // First check if user is already enrolled
  const existingEnrollment = await getEnrollment(input.course_id, input.user_id);
  
  if (existingEnrollment) {
    throw new Error('You are already enrolled in this course');
  }

  const { data, error } = await supabase
    .from('course_enrollments')
    .insert(input)
    .select()
    .single();

  if (error) {
    // Check if it's a duplicate key error
    if (error.code === '23505') {
      throw new Error('You are already enrolled in this course');
    }
    throw new Error(`Failed to enroll in course: ${error.message}`);
  }

  return data as CourseEnrollment;
}

/**
 * Get user's enrollments
 */
export async function getUserEnrollments(userId: string): Promise<CourseEnrollment[]> {
  const { data, error } = await supabase
    .from('course_enrollments')
    .select('*')
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch enrollments: ${error.message}`);
  }

  return data as CourseEnrollment[];
}

/**
 * Get a specific enrollment
 */
export async function getEnrollment(courseId: string, userId: string): Promise<CourseEnrollment | null> {
  const { data, error } = await supabase
    .from('course_enrollments')
    .select('*')
    .eq('course_id', courseId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch enrollment: ${error.message}`);
  }

  return data as CourseEnrollment;
}

/**
 * Update enrollment progress
 */
export async function updateEnrollment(
  courseId: string,
  userId: string,
  input: UpdateEnrollmentInput
): Promise<CourseEnrollment> {
  const { data, error } = await supabase
    .from('course_enrollments')
    .update(input)
    .eq('course_id', courseId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update enrollment: ${error.message}`);
  }

  return data as CourseEnrollment;
}

/**
 * Get course enrollments count
 */
export async function getCourseEnrollmentCount(courseId: string): Promise<number> {
  const { count, error } = await supabase
    .from('course_enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', courseId);

  if (error) {
    throw new Error(`Failed to fetch enrollment count: ${error.message}`);
  }

  return count || 0;
}
