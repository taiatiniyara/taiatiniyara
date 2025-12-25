export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  category: string | null;
  level: 'beginner' | 'intermediate' | 'advanced' | null;
  technologies: string[];
  featured: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  video_url: string | null;
  duration_minutes: number;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  user_id: string;
  user_email: string;
  enrolled_at: string;
  completed_at: string | null;
  progress: number;
  last_accessed_module_id?: string | null;
}

export interface CourseWithModules extends Course {
  modules: CourseModule[];
  total_modules: number;
  total_duration_minutes: number;
}

export interface CreateCourseInput {
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  technologies?: string[];
  featured?: boolean;
  published?: boolean;
  published_at?: string;
}

export interface UpdateCourseInput {
  title?: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  technologies?: string[];
  featured?: boolean;
  published?: boolean;
  published_at?: string;
}

export interface CreateModuleInput {
  course_id: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  video_url?: string;
  duration_minutes?: number;
  order_index: number;

  published?: boolean;
}

export interface UpdateModuleInput {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  video_url?: string;
  duration_minutes?: number;
  order_index?: number;
  published?: boolean;
}

export interface CoursesResponse {
  courses: Course[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface EnrollmentInput {
  course_id: string;
  user_id: string;
  user_email: string;
}

export interface UpdateEnrollmentInput {
  progress?: number;
  completed_at?: string;
  last_accessed_module_id?: string;
}
