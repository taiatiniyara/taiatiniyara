/**
 * Centralized constants to avoid duplication across the app
 */

// Site Configuration
export const SITE_CONFIG = {
  name: 'Taia Tiniyara',
  title: 'Taia Tiniyara - Software Engineering & Development in Fiji & the Pacific',
  description: 'Helping software engineering and development training in Fiji and the Pacific Islands. Expert software engineers, programmers, and developers offering comprehensive courses for Pacific professionals.',
  baseUrl: 'https://taiatiniyara.com',
  defaultImage: 'https://taiatiniyara.com/og-image.jpg',
  author: 'Taia Tiniyara',
} as const;

// Form Validation
export const FORM_VALIDATION = {
  minPasswordLength: 6,
  passwordError: 'Password must be at least 6 characters',
  passwordMismatchError: 'Passwords do not match',
} as const;

// Query Keys (for React Query)
export const QUERY_KEYS = {
  enrollment: (courseId: string, userId: string) => ['enrollment', courseId, userId],
  courseProgress: (courseId: string) => [`course-progress-${courseId}`],
  courseLessons: (courseId: string) => [`course-lessons/${courseId}`],
  progress: (enrollmentId: string, lessonId: string) => ['progress', enrollmentId, lessonId],
  myCourses: () => ['my-courses'],
  myEnrollments: () => ['my-enrollments'],
  courseCategories: () => ['courseCat'],
} as const;

// Time constants
export const TIME = {
  reloadDelay: 2000,
  successRedirectDelay: 2000,
} as const;

// Pagination
export const PAGINATION = {
  defaultLimit: 100,
  itemsPerPage: 10,
} as const;

// Filter Status
export const FILTER_STATUS = {
  all: 'all',
  ongoing: 'ongoing',
  completed: 'completed',
} as const;

export type FilterStatus = typeof FILTER_STATUS[keyof typeof FILTER_STATUS];

// Course Difficulty Levels
export const DIFFICULTY_LEVELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
} as const;

// Duration formatting
export const DURATION = {
  minHoursDecimal: 1,
  decimalPlaces: 1,
} as const;

// Slug generation
export const SLUG_CONFIG = {
  length: 16,
  characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
} as const;

// Reading time calculation
export const READING = {
  wordsPerMinute: 200,
} as const;

// Social media share URLs
export const SOCIAL_SHARE_URLS = {
  facebook: (url: string, _title?: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: (url: string, title?: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}${title ? `&text=${encodeURIComponent(title)}` : ''}`,
  linkedin: (url: string, _title?: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
} as const;

export type SocialPlatform = keyof typeof SOCIAL_SHARE_URLS;
