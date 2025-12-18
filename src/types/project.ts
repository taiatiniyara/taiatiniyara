export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: string | null;
  technologies: string[];
  github_url: string | null;
  demo_url: string | null;
  featured: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail?: string;
  technologies?: string[];
  github_url?: string;
  demo_url?: string;
  featured?: boolean;
  published?: boolean;
  published_at?: string;
}

export interface UpdateProjectInput {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  technologies?: string[];
  github_url?: string;
  demo_url?: string;
  featured?: boolean;
  published?: boolean;
  published_at?: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
