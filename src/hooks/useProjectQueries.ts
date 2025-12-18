import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPublishedProjects,
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  searchProjects,
} from '@/lib/project';
import type { CreateProjectInput, UpdateProjectInput } from '@/types/project';

// Query Keys
export const projectKeys = {
  all: ['project'] as const,
  projects: () => [...projectKeys.all, 'projects'] as const,
  publishedProjects: (page: number, pageSize: number) => 
    [...projectKeys.projects(), 'published', page, pageSize] as const,
  allProjects: (page: number, pageSize: number) => 
    [...projectKeys.projects(), 'all', page, pageSize] as const,
  featuredProjects: () => [...projectKeys.projects(), 'featured'] as const,
  project: (slug: string) => [...projectKeys.projects(), 'detail', slug] as const,
  projectById: (id: string) => [...projectKeys.projects(), 'detail', 'id', id] as const,
  search: (query: string, page: number, pageSize: number) => 
    [...projectKeys.projects(), 'search', query, page, pageSize] as const,
};

// Query Hooks

/**
 * Hook to fetch published projects with pagination
 */
export function usePublishedProjects(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: projectKeys.publishedProjects(page, pageSize),
    queryFn: () => getPublishedProjects(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all projects (including drafts) with pagination
 */
export function useAllProjects(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: projectKeys.allProjects(page, pageSize),
    queryFn: () => getAllProjects(page, pageSize),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch featured projects
 */
export function useFeaturedProjects() {
  return useQuery({
    queryKey: projectKeys.featuredProjects(),
    queryFn: getFeaturedProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single project by slug
 */
export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: projectKeys.project(slug),
    queryFn: () => getProjectBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single project by ID
 */
export function useProjectById(id: string) {
  return useQuery({
    queryKey: projectKeys.projectById(id),
    queryFn: () => getProjectById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to search projects
 */
export function useSearchProjects(query: string | null, page = 1, pageSize = 10) {
  return useQuery({
    queryKey: projectKeys.search(query || '', page, pageSize),
    queryFn: () => searchProjects(query!, page, pageSize),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutation Hooks

/**
 * Hook to create a new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(input),
    onSuccess: () => {
      // Invalidate and refetch project queries
      queryClient.invalidateQueries({ queryKey: projectKeys.projects() });
    },
  });
}

/**
 * Hook to update an existing project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProjectInput }) =>
      updateProject(id, input),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: projectKeys.projects() });
      queryClient.invalidateQueries({ queryKey: projectKeys.project(data.slug) });
      queryClient.invalidateQueries({ queryKey: projectKeys.projectById(data.id) });
    },
  });
}

/**
 * Hook to delete a project
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      // Invalidate project list queries
      queryClient.invalidateQueries({ queryKey: projectKeys.projects() });
    },
  });
}
