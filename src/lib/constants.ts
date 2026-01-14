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
