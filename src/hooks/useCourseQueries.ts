import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  CreateCourseInput,
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
export function usePublishedCourses(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: courseKeys.publishedCourses(page, pageSize),
    queryFn: () => getPublishedCourses(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all courses (including drafts) with pagination
 */
export function useAllCourses(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: courseKeys.allCourses(page, pageSize),
    queryFn: () => getAllCourses(page, pageSize),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch featured courses
 */
export function useFeaturedCourses() {
  return useQuery({
    queryKey: courseKeys.featuredCourses(),
    queryFn: getFeaturedCourses,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch a single course by slug
 */
export function useCourse(slug: string) {
  return useQuery({
    queryKey: courseKeys.course(slug),
    queryFn: () => getCourseBySlug(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });
}

/**
 * Hook to fetch a single course by ID
 */
export function useCourseById(id: string) {
  return useQuery({
    queryKey: courseKeys.courseById(id),
    queryFn: () => getCourseById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

/**
 * Hook to search courses
 */
export function useSearchCourses(query: string, page = 1, pageSize = 10) {
  return useQuery({
    queryKey: courseKeys.search(query, page, pageSize),
    queryFn: () => searchCourses(query, page, pageSize),
    staleTime: 2 * 60 * 1000,
    enabled: query.length > 0,
  });
}

/**
 * Hook to fetch courses by category
 */
export function useCoursesByCategory(category: string) {
  return useQuery({
    queryKey: courseKeys.byCategory(category),
    queryFn: () => getCoursesByCategory(category),
    staleTime: 5 * 60 * 1000,
    enabled: !!category,
  });
}

/**
 * Hook to fetch courses by level
 */
export function useCoursesByLevel(level: 'beginner' | 'intermediate' | 'advanced') {
  return useQuery({
    queryKey: courseKeys.byLevel(level),
    queryFn: () => getCoursesByLevel(level),
    staleTime: 5 * 60 * 1000,
    enabled: !!level,
  });
}

// ============ MODULE QUERY HOOKS ============

/**
 * Hook to fetch modules for a course
 */
export function useModulesByCourse(courseId: string) {
  return useQuery({
    queryKey: courseKeys.modules(courseId),
    queryFn: () => getModulesByCourse(courseId),
    staleTime: 5 * 60 * 1000,
    enabled: !!courseId,
  });
}

/**
 * Hook to fetch a single module by ID
 */
export function useModule(id: string) {
  return useQuery({
    queryKey: courseKeys.module(id),
    queryFn: () => getModuleById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

/**
 * Hook to fetch a module by course and slug
 */
export function useModuleBySlug(courseId: string, slug: string) {
  return useQuery({
    queryKey: courseKeys.moduleBySlug(courseId, slug),
    queryFn: () => getModuleBySlug(courseId, slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!courseId && !!slug,
  });
}

// ============ ENROLLMENT QUERY HOOKS ============

/**
 * Hook to fetch user's enrollments
 */
export function useUserEnrollments(userId: string) {
  return useQuery({
    queryKey: courseKeys.enrollments(userId),
    queryFn: () => getUserEnrollments(userId),
    staleTime: 2 * 60 * 1000,
    enabled: !!userId,
  });
}

/**
 * Hook to fetch a specific enrollment
 */
export function useEnrollment(courseId: string, userId: string) {
  return useQuery({
    queryKey: courseKeys.enrollment(courseId, userId),
    queryFn: () => getEnrollment(courseId, userId),
    staleTime: 2 * 60 * 1000,
    enabled: !!courseId && !!userId,
  });
}

/**
 * Hook to fetch course enrollment count
 */
export function useCourseEnrollmentCount(courseId: string) {
  return useQuery({
    queryKey: courseKeys.enrollmentCount(courseId),
    queryFn: () => getCourseEnrollmentCount(courseId),
    staleTime: 5 * 60 * 1000,
    enabled: !!courseId,
  });
}

// ============ COURSE MUTATION HOOKS ============

/**
 * Hook to create a new course
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();

  console.log('useCreateCourse called', queryClient);

  return useMutation({
    mutationFn: (input: CreateCourseInput) => createCourse(input),
    onSuccess: () => {
      console.log('Course created successfully');
      queryClient.invalidateQueries({ queryKey: courseKeys.courses() });
    },
    onError: (error) => {
      console.error('Error in useCreateCourse mutation:', error);
    },
  });
}

/**
 * Hook to update a course
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCourseInput }) =>
      updateCourse(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.courses() });
      queryClient.invalidateQueries({ queryKey: courseKeys.courseById(variables.id) });
    },
  });
}

/**
 * Hook to delete a course
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.courses() });
    },
  });
}

// ============ MODULE MUTATION HOOKS ============

/**
 * Hook to create a new module
 */
export function useCreateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateModuleInput) => {
      console.log('useCreateModule mutationFn called with:', input);
      return createModule(input);
    },
    onSuccess: (data, variables) => {
      console.log('Module created successfully:', data);
      queryClient.invalidateQueries({ queryKey: courseKeys.modules(variables.course_id) });
      queryClient.invalidateQueries({ queryKey: courseKeys.courseById(variables.course_id) });
    },
    onError: (error) => {
      console.error('Error in useCreateModule mutation:', error);
    },
  });
}

/**
 * Hook to update a module
 */
export function useUpdateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateModuleInput }) => {
      console.log('useUpdateModule mutationFn called with:', id, input);
      return updateModule(id, input);
    },
    onSuccess: (data) => {
      console.log('Module updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: courseKeys.modules(data.course_id) });
      queryClient.invalidateQueries({ queryKey: courseKeys.module(data.id) });
      queryClient.invalidateQueries({ queryKey: courseKeys.courseById(data.course_id) });
    },
    onError: (error) => {
      console.error('Error in useUpdateModule mutation:', error);
    },
  });
}

/**
 * Hook to delete a module
 */
export function useDeleteModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; courseId: string }) => deleteModule(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.modules(variables.courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.courseById(variables.courseId) });
    },
  });
}

// ============ ENROLLMENT MUTATION HOOKS ============

/**
 * Hook to enroll in a course
 */
export function useEnrollInCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: EnrollmentInput) => enrollInCourse(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.enrollments(variables.user_id),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.enrollment(variables.course_id, variables.user_id),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.enrollmentCount(variables.course_id),
      });
    },
  });
}

/**
 * Hook to update enrollment progress
 */
export function useUpdateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      userId,
      input,
    }: {
      courseId: string;
      userId: string;
      input: UpdateEnrollmentInput;
    }) => updateEnrollment(courseId, userId, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.enrollments(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.enrollment(variables.courseId, variables.userId),
      });
    },
  });
}
