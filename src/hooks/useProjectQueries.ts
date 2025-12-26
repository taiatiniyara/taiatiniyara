import { useState, useEffect } from 'react';
import type { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project';
import { 
  getAllProjects,
  getPublishedProjects,
  getFeaturedProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from '@/lib/project';

// Hook to fetch all projects (including drafts for admin)
export function useAllProjects(page: number = 1, limit: number = 100) {
  const [data, setData] = useState<{ projects: Project[] }>({ projects: [] });
  const [isPending, setIsPending] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setIsPending(true);
        setIsError(false);
        setError(null);

        const projects = await getAllProjects();
        
        if (!isMounted) return;
        
        setData({ projects });
      } catch (err) {
        if (!isMounted) return;
        
        setIsError(true);
        setError(err as Error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsPending(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [page, limit]);

  return {
    data,
    isPending,
    isLoading,
    isError,
    error,
  };
}

// Hook to fetch published projects only
export function usePublishedProjects() {
  const [data, setData] = useState<{ projects: Project[] }>({ projects: [] });
  const [isPending, setIsPending] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setIsPending(true);
        setIsError(false);
        setError(null);

        const projects = await getPublishedProjects();
        
        if (!isMounted) return;
        
        setData({ projects });
      } catch (err) {
        if (!isMounted) return;
        
        setIsError(true);
        setError(err as Error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsPending(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    isPending,
    isLoading,
    isError,
    error,
  };
}

// Hook to fetch featured projects
export function useFeaturedProjects() {
  const [data, setData] = useState<{ projects: Project[] }>({ projects: [] });
  const [isPending, setIsPending] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setIsPending(true);
        setIsError(false);
        setError(null);

        const projects = await getFeaturedProjects();
        
        if (!isMounted) return;
        
        setData({ projects });
      } catch (err) {
        if (!isMounted) return;
        
        setIsError(true);
        setError(err as Error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsPending(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    isPending,
    isLoading,
    isError,
    error,
  };
}

// Hook to fetch a single project by slug
export function useProject(slug: string) {
  const [data, setData] = useState<Project | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setIsPending(true);
        setIsError(false);
        setError(null);

        const project = await getProjectBySlug(slug);
        
        if (!isMounted) return;
        
        setData(project);
      } catch (err) {
        if (!isMounted) return;
        
        setIsError(true);
        setError(err as Error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsPending(false);
        }
      }
    };

    if (slug) {
      fetchProject();
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return {
    data,
    isPending,
    isLoading,
    isError,
    error,
  };
}

export function useCreateProject() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async (input: CreateProjectInput) => {
    setIsPending(true);
    setError(null);
    try {
      const result = await createProject(input);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const mutate = (input: CreateProjectInput) => {
    mutateAsync(input).catch(console.error);
  };

  return { 
    mutate,
    mutateAsync,
    isPending,
    error,
  };
}

export function useUpdateProject() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async ({ id, input }: { id: string; input: UpdateProjectInput }) => {
    setIsPending(true);
    setError(null);
    try {
      const result = await updateProject(id, input);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const mutate = ({ id, input }: { id: string; input: UpdateProjectInput }) => {
    mutateAsync({ id, input }).catch(console.error);
  };

  return { 
    mutate,
    mutateAsync,
    isPending,
    error,
  };
}

export function useDeleteProject() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async (id: string) => {
    setIsPending(true);
    setError(null);
    try {
      await deleteProject(id);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const mutate = (id: string) => {
    mutateAsync(id).catch(console.error);
  };

  return { 
    mutate,
    mutateAsync,
    isPending,
    error,
  };
}

export function useProjectQueries() {
  // Implementation placeholder
  return {};
}
