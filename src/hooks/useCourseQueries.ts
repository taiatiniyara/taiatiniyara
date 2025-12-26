import { useState, useEffect } from 'react';
import type { Course, CreateCourseInput, UpdateCourseInput, CreateModuleInput, UpdateModuleInput } from '@/types/course';
import { 
  getCourseBySlug, 
  getModulesByCourse,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  createModule,
  updateModule,
  deleteModule,
} from '@/lib/course';

// Hook to fetch a single course with its modules
export function useCourse(slug: string) {
  const [data, setData] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        setIsPending(true);
        setIsError(false);
        setError(null);

        const courseData = await getCourseBySlug(slug);
        
        if (!isMounted) return;

        if (courseData) {
          // Fetch modules for the course
          const modulesData = await getModulesByCourse(courseData.id);
          
          if (!isMounted) return;

          // Attach modules to the course object
          const courseWithModules = {
            ...courseData,
            modules: modulesData,
          };
          
          setData(courseWithModules);
        } else {
          setData(null);
        }
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

    fetchCourse();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return {
    data,
    isLoading,
    isPending,
    isError,
    error,
  };
}

export function useAllCourses(..._args: any[]) {
  const [data, setData] = useState<{ courses: Course[] }>({ courses: [] });
  const [isPending, setIsPending] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setIsPending(true);
        setIsError(false);
        setError(null);

        const courses = await getAllCourses();
        
        if (!isMounted) return;
        
        setData({ courses });
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

    fetchCourses();

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

export function useCreateCourse() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (input: CreateCourseInput) => {
    setIsPending(true);
    try {
      const result = await createCourse(input);
      return result;
    } finally {
      setIsPending(false);
    }
  };

  return { 
    mutateAsync,
    isPending,
  };
}

export function useUpdateCourse() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async ({ id, input }: { id: string; input: UpdateCourseInput }) => {
    setIsPending(true);
    try {
      const result = await updateCourse(id, input);
      return result;
    } finally {
      setIsPending(false);
    }
  };

  return { 
    mutateAsync,
    isPending,
  };
}

export function useDeleteCourse() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (id: string) => {
    setIsPending(true);
    try {
      await deleteCourse(id);
    } finally {
      setIsPending(false);
    }
  };

  return { 
    mutateAsync,
    isPending,
  };
}

export function useModulesByCourse(courseId: string) {
  const [data, setData] = useState<any[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchModules = async () => {
      try {
        setIsLoading(true);
        setIsPending(true);

        const modules = await getModulesByCourse(courseId);
        
        if (!isMounted) return;
        
        setData(modules);
      } catch (err) {
        console.error('Error fetching modules:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsPending(false);
        }
      }
    };

    if (courseId) {
      fetchModules();
    }

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  return { data, isPending, isLoading };
}

export function useCreateModule() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (input: CreateModuleInput) => {
    setIsPending(true);
    try {
      const result = await createModule(input);
      return result;
    } finally {
      setIsPending(false);
    }
  };

  return { 
    mutateAsync,
    isPending,
  };
}

export function useUpdateModule() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async ({ id, input }: { id: string; input: UpdateModuleInput }) => {
    setIsPending(true);
    try {
      const result = await updateModule(id, input);
      return result;
    } finally {
      setIsPending(false);
    }
  };

  return { 
    mutateAsync,
    isPending,
  };
}

export function useDeleteModule() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (id: string) => {
    setIsPending(true);
    try {
      await deleteModule(id);
    } finally {
      setIsPending(false);
    }
  };

  return { 
    mutateAsync,
    isPending,
  };
}

export function useCourseQueries() {
  // Implementation placeholder
  return {};
}
