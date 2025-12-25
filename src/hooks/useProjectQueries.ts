import { useQuery, useMutation, STALE_TIME, queryCache } from '@/lib/supabase-query';
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
import type { UpdateProjectInput } from '@/types/project';

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
export const usePublishedProjects = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: projectKeys.publishedProjects(page, pageSize),
    queryFn: () => getPublishedProjects(page, pageSize),
    staleTime: STALE_TIME.MEDIUM,
  });
};

/**
 * Hook to fetch all projects (including drafts) with pagination
 */
export const useAllProjects = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: projectKeys.allProjects(page, pageSize),
    queryFn: () => getAllProjects(page, pageSize),
    staleTime: STALE_TIME.SHORT,
  });
};

/**
 * Hook to fetch featured projects
 */
export const useFeaturedProjects = () => {
  return useQuery({
    queryKey: projectKeys.featuredProjects(),
    queryFn: getFeaturedProjects,
    staleTime: STALE_TIME.MEDIUM,
  });
};

/**
 * Hook to fetch a single project by slug
 */
export const useProjectBySlug = (slug: string) => {
  return useQuery({
    queryKey: projectKeys.project(slug),
    queryFn: () => getProjectBySlug(slug),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!slug,
  });
};

/**
 * Hook to fetch a single project by ID
 */
export const useProjectById = (id: string) => {
  return useQuery({
    queryKey: projectKeys.projectById(id),
    queryFn: () => getProjectById(id),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!id,
  });
};

/**
 * Hook to search projects
 */
export const useSearchProjects = (query: string, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: projectKeys.search(query, page, pageSize),
    queryFn: () => searchProjects(query, page, pageSize),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!query && query.length > 0,
  });
};

// Mutation Hooks

/**
 * Hook to create a new project
 */
export const useCreateProject = () => {
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryCache.invalidate('project');
    },
    invalidateKeys: [projectKeys.projects()],
  });
};

/**
 * Hook to update an existing project
 */
export const useUpdateProject = () => {
  return useMutation<any, { id: string; input: UpdateProjectInput }>({
    mutationFn: ({ id, input }) => updateProject(id, input),
    onSuccess: () => {
      queryCache.invalidate('project');
    },
    invalidateKeys: [projectKeys.projects()],
  });
};

/**
 * Hook to delete a project
 */
export const useDeleteProject = () => {
  return useMutation<void, string>({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryCache.invalidate('project');
    },
    invalidateKeys: [projectKeys.projects()],
  });
};
