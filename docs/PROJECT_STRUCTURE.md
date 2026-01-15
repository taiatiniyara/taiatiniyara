# Project Structure Documentation

## Overview

This document provides a comprehensive overview of the Taia Tiniyara project structure, explaining the purpose and organization of each directory and key files.

**Last Updated:** January 15, 2026  
**Build Status:** ✅ Production Ready  
**Latest Build:** Successfully compiled with zero errors

---

## Root Directory

```
taiatiniyara/
├── docs/                    # Project documentation
├── public/                  # Static assets served directly
├── scripts/                 # Build and utility scripts
├── src/                     # Source code
├── components.json          # shadcn/ui configuration
├── drizzle.config.ts       # Drizzle ORM configuration
├── eslint.config.js        # ESLint configuration
├── firebase.json           # Firebase deployment config
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── README.md               # Main project documentation
├── tsconfig.app.json       # App TypeScript config
├── tsconfig.json           # Base TypeScript config
├── tsconfig.node.json      # Node TypeScript config
└── vite.config.ts          # Vite build configuration
```

---

## Documentation (`docs/`)

Comprehensive project documentation for various aspects of the application:

```
docs/
├── about.txt                          # Professional profile and bio
├── AUTH_README.md                     # Authentication system documentation
├── COURSES_QUICK_REFERENCE.md         # Quick guide to courses features
├── COURSES_README.md                  # Detailed courses system docs
├── DOCUMENTATION_UPDATE_LOG.md        # Change log for documentation
├── IMPLEMENTATION_SUMMARY.md          # Implementation and refactoring summary
├── SEO_GUIDE.md                       # SEO optimization guide
├── SEO_OPTIMIZATION_SUMMARY.md        # SEO implementation details
└── SEO_QUICK_REFERENCE.md             # Quick SEO tips
```

---

## Public Assets (`public/`)

Static files served directly without processing:

```
public/
├── robots.txt              # Search engine crawler instructions
└── sitemap.xml            # SEO sitemap (auto-generated)
```

---

## Scripts (`scripts/`)

Build and automation scripts:

```
scripts/
└── generate-blog-pages.ts  # Generates static blog pages for SSR
```

---

## Source Code (`src/`)

### Main Entry Files

```
src/
├── main.tsx                # Application entry point
├── index.css              # Global styles and Tailwind imports
└── routeTree.gen.ts       # Auto-generated route tree (TanStack Router)
```

### Assets (`src/assets/`)

Images, fonts, and other static resources used in the application.

### Components (`src/components/`)

Reusable React components organized by feature:

```
components/
├── footer.tsx              # Site footer component
├── nav.tsx                # Navigation bar component
├── theme-toggle.tsx       # Dark/light mode toggle
├── tiptap.tsx            # Rich text editor component
├── tiptap-lazy.tsx       # Lazy-loaded TipTap editor
│
├── auth/                  # Authentication-related components
│   ├── forgot-password-form.tsx
│   ├── login-form.tsx
│   ├── protected-route.tsx
│   ├── reset-password-form.tsx
│   └── signup-form.tsx
│
├── blog/                  # Blog feature components
│   ├── blogComments.tsx
│   ├── createBlog.tsx
│   ├── editBlog.tsx
│   └── otherBlogs.tsx
│
├── courses/               # Course management components
│   ├── createCourseCategory.tsx
│   ├── createCourse.tsx
│   ├── createLesson.tsx
│   ├── editCourse.tsx
│   ├── editCourseCategory.tsx
│   ├── editLesson.tsx
│   ├── enrollButton.tsx
│   └── lessonComments.tsx
│
├── forms/                 # Generic form components
│   ├── createForm.tsx
│   └── editForm.tsx
│
├── img/                   # Image-related components
│
├── projects/              # Project showcase components
│   ├── createProject.tsx
│   └── editProject.tsx
│
└── ui/                    # Shared UI components (Design System)
    ├── activity-feed.tsx
    ├── admin-crud-page.tsx
    ├── admin-header.tsx
    ├── alert-dialog.tsx
    ├── auth-form-wrapper.tsx
    ├── auth-input-field.tsx
    ├── avatar.tsx
    ├── badge.tsx
    ├── breadcrumb.tsx
    ├── button.tsx
    ├── card.tsx
    ├── checkbox.tsx
    ├── combobox.tsx
    ├── content-card.tsx
    ├── empty-list-placeholder.tsx
    ├── error.tsx
    ├── error-message.tsx
    ├── form-field.tsx
    ├── input.tsx
    ├── label.tsx
    ├── loading-spinner.tsx
    ├── page-hero.tsx
    ├── search-and-filter.tsx     # NEW: Reusable search/filter component
    ├── select.tsx
    ├── stat-card.tsx
    ├── tags-input.tsx
    ├── textarea.tsx
    └── ... (additional UI components)
```

### Context (`src/context/`)

React Context providers for global state management:

```
context/
├── auth-context.tsx       # Authentication state provider
└── theme-context.tsx      # Theme (dark/light mode) provider
```

### Hooks (`src/hooks/`)

Custom React hooks for reusable logic:

```
hooks/
├── useAsync.ts                    # Async operation handler
├── useAuthForm.ts                 # Authentication form logic
├── useCourseAccess.ts            # Course access validation
├── useCourseProgress.ts          # Course progress tracking
├── useEnrollment.ts              # Course enrollment logic
├── useEnrollmentData.ts          # Enrollment data fetching
├── useFormState.ts               # Form state management
├── useLessonAccess.ts            # Lesson access validation
├── useProgressTracking.ts        # Progress tracking logic
├── useSEO.ts                     # SEO meta tag management
├── useStructuredData.ts          # JSON-LD structured data
├── useSupabaseCreate.ts          # Supabase create operations
├── useSupabaseInfiniteQuery.ts   # Infinite scroll queries
└── useSupabaseQuery.ts           # Supabase data queries
```

### Library/Utilities (`src/lib/`)

Utility functions, configurations, and database schema:

```
lib/
├── constants.ts                   # App-wide constants (ENHANCED)
├── form-utils.ts                  # Form processing utilities (ENHANCED)
├── generate-sitemap.ts           # Sitemap generation script
├── lesson-utils.ts               # Lesson-related utilities
├── seo-utils.ts                  # SEO helper functions
├── sitemap-generator.ts          # Sitemap generator logic
├── supabase.ts                   # Supabase client setup
├── supabase-query-builder.ts    # Query builder helper
├── utils.ts                      # General utilities (ENHANCED)
│
└── drizzle/                      # Database schema and types
    └── schema.ts                 # Drizzle ORM schema definitions
```

### Routes (`src/routes/`)

File-based routing with TanStack Router:

```
routes/
├── __root.tsx                     # Root layout component
├── about.tsx                      # About page
├── index.tsx                      # Home page
├── login.tsx                      # Login page
├── signup.tsx                     # Signup page
├── profile.tsx                    # User profile page
├── forgot-password.tsx           # Password recovery
├── reset-password.tsx            # Password reset
├── unauthorized.tsx              # 401 error page
│
├── admin.tsx                      # Admin layout
├── admin.index.tsx               # Admin dashboard
├── admin.blog.tsx                # Blog management
├── admin.courses.tsx             # Course management
├── admin.projects.tsx            # Project management
├── admin.users.tsx               # User management
├── admin.courses_.$courseSlug.lessons.tsx  # Lesson management
│
├── blog/                          # Blog feature routes
│   ├── index.tsx                 # Blog list page
│   └── $slug.tsx                 # Individual blog post
│
├── courses/                       # Course feature routes
│   ├── index.tsx                 # Course catalog
│   ├── $slug.tsx                 # Course detail page
│   └── $courseSlug.$lessonSlug.tsx  # Lesson viewer
│
├── projects/                      # Project showcase routes
│   ├── index.tsx                 # Project list page
│   └── $slug.tsx                 # Project detail page
│
└── student/                       # Student dashboard routes
    ├── index.tsx                 # Student overview
    └── courses.tsx               # Enrolled courses
```

---

## Configuration Files

### TypeScript Configuration

- **`tsconfig.json`** - Base TypeScript configuration
- **`tsconfig.app.json`** - Application-specific TS config
- **`tsconfig.node.json`** - Node.js scripts TS config

### Build & Development

- **`vite.config.ts`** - Vite build tool configuration
- **`eslint.config.js`** - Code linting rules
- **`components.json`** - shadcn/ui component configuration

### Database

- **`drizzle.config.ts`** - Drizzle ORM database configuration

### Deployment

- **`firebase.json`** - Firebase hosting configuration

---

## Key Patterns & Conventions

### Routing Convention

Uses TanStack Router's file-based routing:
- `index.tsx` - Default route for a directory
- `$param.tsx` - Dynamic parameter route
- `_layout.tsx` - Layout wrapper (underscore prefix)
- `admin.tsx` - Parent route
- `admin.index.tsx` - Nested index route

### Component Organization

1. **Feature-based folders** - Components grouped by feature (blog, courses, projects)
2. **UI components** - Reusable design system components in `components/ui/`
3. **Form components** - Generic form builders in `components/forms/`
4. **Auth components** - Authentication-specific in `components/auth/`

### Hook Naming

- `use*` prefix for all hooks
- Descriptive names indicating purpose (e.g., `useSupabaseQuery`, `useAuthForm`)
- Custom hooks in `src/hooks/` directory

### Utility Organization

- **`constants.ts`** - All app-wide constants
- **`utils.ts`** - General utility functions
- **`form-utils.ts`** - Form-specific utilities
- **`seo-utils.ts`** - SEO-specific utilities
- **Feature-specific utils** - Named `[feature]-utils.ts`

---

## Database Schema Structure

Located in `src/lib/drizzle/schema.ts`:

### Main Tables

1. **`user_profiles`** - Extended user information
2. **`projects`** - Portfolio projects
3. **`blog_posts`** - Blog articles
4. **`blog_comments`** - Blog comments
5. **`courses`** - Course information
6. **`course_categories`** - Course categories
7. **`lessons`** - Course lessons
8. **`lesson_comments`** - Lesson comments
9. **`enrollments`** - Student enrollments
10. **`progress_tracking`** - Lesson completion tracking

### Relationships

- Courses → Categories (many-to-one)
- Lessons → Courses (many-to-one)
- Comments → Users (many-to-one)
- Enrollments → Users + Courses (many-to-many)
- Progress → Enrollments + Lessons (many-to-many)

---

## Recent Refactoring Improvements

### Enhanced Files (January 15, 2026)

1. **`src/lib/constants.ts`**
   - Added pagination, filter status, difficulty levels
   - Centralized configuration values

2. **`src/lib/utils.ts`**
   - Improved with additional utility functions
   - Enhanced documentation

3. **`src/hooks/useSupabaseQuery.ts`**
   - Added comprehensive TypeScript interfaces
   - Better error handling

4. **`src/hooks/useSupabaseCreate.ts`**
   - Enhanced return types
   - Improved documentation

5. **`src/hooks/useAuthForm.ts`**
   - Added AuthFormState interface
   - Better error handling with try-finally

6. **`src/lib/form-utils.ts`**
   - Type-safe form handling
   - Enhanced interfaces and documentation

7. **`src/components/ui/search-and-filter.tsx`** (NEW)
   - Reusable search and filter component
   - Supports multiple filter groups

---

## Development Workflow

### Adding New Features

1. **Create components** in appropriate feature folder
2. **Add routes** in `src/routes/` following naming conventions
3. **Create hooks** if reusable logic is needed
4. **Add utilities** in `src/lib/` if helper functions needed
5. **Update schema** in `src/lib/drizzle/schema.ts` if database changes required
6. **Run migrations** with `npm run db-push`

### Styling

- Tailwind CSS for utility-first styling
- Dark/light mode support via theme context
- Consistent spacing and color tokens
- Responsive design with mobile-first approach

### State Management

- **TanStack Query** for server state
- **React Context** for global client state (auth, theme)
- **Local state** with useState/useReducer for component state

---

## Build Process

1. **TypeScript Compilation** - Checks type safety
2. **Vite Build** - Bundles and optimizes assets
3. **Blog Page Generation** - Creates static blog pages
4. **Sitemap Generation** - Updates SEO sitemap
5. **Firebase Deploy** - Deploys to hosting

---

## Testing Strategy

### Manual Testing Flows

1. **Admin Flow**: Create/edit content
2. **Student Flow**: Browse, enroll, track progress
3. **Auth Flow**: Login, signup, password reset
4. **Public Flow**: View content without auth

### Areas to Test

- Authentication and authorization
- CRUD operations for all entities
- Enrollment and progress tracking
- Responsive design at all breakpoints
- Dark/light mode switching
- Form validation and error handling

---

## Performance Optimizations

- **Code splitting** with dynamic imports
- **Lazy loading** for TipTap editor
- **Image optimization** (recommended)
- **Route-based code splitting** with TanStack Router
- **Query caching** with TanStack Query
- **Efficient re-renders** with proper memoization

---

## Security Considerations

- **Protected routes** with auth checks
- **Role-based access control** (admin vs. user)
- **Input validation** on forms
- **SQL injection protection** via Drizzle ORM
- **XSS protection** in rich text content
- **Environment variables** for sensitive data

---

## Future Enhancements

See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for detailed future plans.

---

**Maintained By:** Taia Tiniyara  
**Last Updated:** January 15, 2026  
**Status:** Production-ready and actively maintained
