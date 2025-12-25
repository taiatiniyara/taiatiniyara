import { useQuery, useMutation, STALE_TIME, queryCache } from '@/lib/supabase-query';
import {
  getPublishedCourses,
  getAllCourses,
  getFeaturedCourses,
  getCourseBySlug,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  searchCourses,
  getCoursesByCategory,
  getCoursesByLevel,
  getModulesByCourse,
  getModuleById,
  getModuleBySlug,
  createModule,
  updateModule,
  deleteModule,
  enrollInCourse,
  getUserEnrollments,
  getEnrollment,
  updateEnrollment,
  getCourseEnrollmentCount,
} from '@/lib/course';
import type {
  UpdateCourseInput,
  CreateModuleInput,
  UpdateModuleInput,
  EnrollmentInput,
  UpdateEnrollmentInput,
} from '@/types/course';

// Query Keys
export const courseKeys = {
  all: ['course'] as const,
  courses: () => [...courseKeys.all, 'courses'] as const,
  publishedCourses: (page: number, pageSize: number) =>
    [...courseKeys.courses(), 'published', page, pageSize] as const,
  allCourses: (page: number, pageSize: number) =>
    [...courseKeys.courses(), 'all', page, pageSize] as const,
  featuredCourses: () => [...courseKeys.courses(), 'featured'] as const,
  course: (slug: string) => [...courseKeys.courses(), 'detail', slug] as const,
  courseById: (id: string) => [...courseKeys.courses(), 'detail', 'id', id] as const,
  search: (query: string, page: number, pageSize: number) =>
    [...courseKeys.courses(), 'search', query, page, pageSize] as const,
  byCategory: (category: string) => [...courseKeys.courses(), 'category', category] as const,
  byLevel: (level: string) => [...courseKeys.courses(), 'level', level] as const,
  modules: (courseId: string) => [...courseKeys.all, 'modules', courseId] as const,
  module: (id: string) => [...courseKeys.all, 'module', id] as const,
  moduleBySlug: (courseId: string, slug: string) =>
    [...courseKeys.all, 'module', courseId, slug] as const,
  enrollments: (userId: string) => [...courseKeys.all, 'enrollments', userId] as const,
  enrollment: (courseId: string, userId: string) =>
    [...courseKeys.all, 'enrollment', courseId, userId] as const,
  enrollmentCount: (courseId: string) =>
    [...courseKeys.all, 'enrollmentCount', courseId] as const,
};

// ============ COURSE QUERY HOOKS ============

/**
 * Hook to fetch published courses with pagination
 */
export const usePublishedCourses = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: courseKeys.publishedCourses(page, pageSize),
    queryFn: () => getPublishedCourses(page, pageSize),
    staleTime: STALE_TIME.MEDIUM,
  });
};

/**
 * Hook to fetch all courses (including drafts) with pagination
 */
export const useAllCourses = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: courseKeys.allCourses(page, pageSize),
    queryFn: () => getAllCourses(page, pageSize),
    staleTime: STALE_TIME.SHORT,
  });
};

/**
 * Hook to fetch featured courses
 */
export const useFeaturedCourses = () => {
  return useQuery({
    queryKey: courseKeys.featuredCourses(),
    queryFn: getFeaturedCourses,
    staleTime: STALE_TIME.LONG,
  });
};

/**
 * Hook to fetch a single course by slug
 */
export const useCourse = (slug: string) => {
  return useQuery({
    queryKey: courseKeys.course(slug),
    queryFn: () => getCourseBySlug(slug),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!slug,
  });
};

/**
 * Hook to fetch a single course by ID
 */
export const useCourseById = (id: string) => {
  return useQuery({
    queryKey: courseKeys.courseById(id),
    queryFn: () => getCourseById(id),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!id,
  });
};

/**
 * Hook to search courses
 */
export const useSearchCourses = (query: string, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: courseKeys.search(query, page, pageSize),
    queryFn: () => searchCourses(query, page, pageSize),
    staleTime: STALE_TIME.SHORT,
    enabled: !!query && query.length > 0,
  });
};

/**
 * Hook to fetch courses by category
 */
export const useCoursesByCategory = (category: string) => {
  return useQuery({
    queryKey: courseKeys.byCategory(category),
    queryFn: () => getCoursesByCategory(category),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!category,
  });
};

/**
 * Hook to fetch courses by level
 */
export const useCoursesByLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
  return useQuery({
    queryKey: courseKeys.byLevel(level),
    queryFn: () => getCoursesByLevel(level),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!level,
  });
};

// ============ MODULE QUERY HOOKS ============

/**
 * Hook to fetch modules for a course
 */
export const useModulesByCourse = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.modules(courseId),
    queryFn: () => getModulesByCourse(courseId),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!courseId,
  });
};

/**
 * Hook to fetch a single module by ID
 */
export const useModule = (id: string) => {
  return useQuery({
    queryKey: courseKeys.module(id),
    queryFn: () => getModuleById(id),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!id,
  });
};

/**
 * Hook to fetch a module by course and slug
 */
export const useModuleBySlug = ({ courseId, slug }: { courseId: string; slug: string }) => {
  return useQuery({
    queryKey: courseKeys.moduleBySlug(courseId, slug),
    queryFn: () => getModuleBySlug(courseId, slug),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!courseId && !!slug,
  });
};

// ============ ENROLLMENT QUERY HOOKS ============

/**
 * Hook to fetch user's enrollments
 */
export const useUserEnrollments = (userId: string) => {
  return useQuery({
    queryKey: courseKeys.enrollments(userId),
    queryFn: () => getUserEnrollments(userId),
    staleTime: STALE_TIME.SHORT,
    enabled: !!userId,
  });
};

/**
 * Hook to fetch a specific enrollment
 */
export const useEnrollment = ({ courseId, userId }: { courseId: string; userId: string }) => {
  return useQuery({
    queryKey: courseKeys.enrollment(courseId, userId),
    queryFn: () => getEnrollment(courseId, userId),
    staleTime: STALE_TIME.SHORT,
    enabled: !!courseId && !!userId,
  });
};

/**
 * Hook to fetch course enrollment count
 */
export const useCourseEnrollmentCount = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.enrollmentCount(courseId),
    queryFn: () => getCourseEnrollmentCount(courseId),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!courseId,
  });
};

// ============ COURSE MUTATION HOOKS ============

/**
 * Hook to create a new course
 */
export const useCreateCourse = () => {
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryCache.invalidate('course');
    },
    invalidateKeys: [courseKeys.courses()],
  });
};

/**
 * Hook to update a course
 */
export const useUpdateCourse = () => {
  return useMutation<any, { id: string; input: UpdateCourseInput }>({
    mutationFn: ({ id, input }) => updateCourse(id, input),
    onSuccess: () => {
      queryCache.invalidate('course');
    },
    invalidateKeys: [courseKeys.courses()],
  });
};

/**
 * Hook to delete a course
 */
export const useDeleteCourse = () => {
  return useMutation<void, string>({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryCache.invalidate('course');
    },
    invalidateKeys: [courseKeys.courses()],
  });
};

// ============ MODULE MUTATION HOOKS ============

/**
 * Hook to create a new module
 */
export const useCreateModule = () => {
  return useMutation<any, CreateModuleInput>({
    mutationFn: createModule,
    onSuccess: () => {
      queryCache.invalidate('course');
    },
    invalidateKeys: [courseKeys.all],
  });
};

/**
 * Hook to update a module
 */
export const useUpdateModule = () => {
  return useMutation<any, { id: string; input: UpdateModuleInput }>({
    mutationFn: ({ id, input }) => updateModule(id, input),
    onSuccess: () => {
      queryCache.invalidate('course');
    },
    invalidateKeys: [courseKeys.all],
  });
};

/**
 * Hook to delete a module
 */
export const useDeleteModule = () => {
  return useMutation<void, { id: string; courseId: string }>({
    mutationFn: ({ id }) => deleteModule(id),
    onSuccess: () => {
      queryCache.invalidate('course');
    },
    invalidateKeys: [courseKeys.all],
  });
};

// ============ ENROLLMENT MUTATION HOOKS ============

/**
 * Hook to enroll in a course
 */
export const useEnrollInCourse = () => {
  return useMutation<any, EnrollmentInput>({
    mutationFn: enrollInCourse,
    onSuccess: () => {
      queryCache.invalidate('course');
    },
    invalidateKeys: [courseKeys.all],
  });
};

/**
 * Hook to update enrollment progress
 */
export const useUpdateEnrollment = () => {
  return useMutation<any, {
    courseId: string;
    userId: string;
    input: UpdateEnrollmentInput;
  }>({
    mutationFn: ({ courseId, userId, input }) => updateEnrollment(courseId, userId, input),
    onSuccess: () => {
      queryCache.invalidate('course');
    },
    invalidateKeys: [courseKeys.all],
  });
};
