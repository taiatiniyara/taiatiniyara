# Courses Feature Documentation

## Overview

A complete online course platform feature has been added to your application. This feature allows you to create, manage, and publish software development courses with lessons, pricing, and enrollment tracking.

## Features Implemented

### 1. Database Schema (`migrations/courses-table.sql`)
- **courses** table: Stores course information
- **lessons** table: Stores individual lesson content for each course
- **course_enrollments** table: Tracks user enrollments and progress
- Row-Level Security (RLS) policies for data protection
- Automated triggers for updating timestamps

### 2. TypeScript Types (`src/types/course.ts`)
- `Course`: Main course interface
- `Lesson`: Individual lesson interface
- `CourseEnrollment`: User enrollment tracking
- `CourseWithLessons`: Extended course with lessons array
- Input types for creating and updating courses/lessons

### 3. Data Layer (`src/lib/course.ts`)
Comprehensive functions for:
- Course CRUD operations
- Lesson management
- Enrollment tracking
- Search and filtering (by category, level, featured)
- Pagination support

### 4. React Hooks (`src/hooks/useCourseQueries.ts`)
Custom hooks using React Query for:
- Fetching published/all courses
- Individual course details
- Lesson management
- Enrollment operations
- Optimistic updates and caching

### 5. Routes
- `/courses` - Course listing page
- `/courses/:slug` - Individual course detail page
- `/courses/admin` - Admin dashboard for course management

### 6. Course Attributes
Each course includes:
- Title, slug, description, and rich content
- Thumbnail image
- Category and difficulty level (beginner/intermediate/advanced)
- Duration in hours
- Technologies covered
- Pricing (supports free and paid courses)
- Featured flag for highlighting
- Publish/draft status
- Multiple lessons with order management

### 7. Lesson Attributes
Each lesson includes:
- Title, slug, and description
- Rich content and video URL
- Duration in minutes
- Order index for curriculum
- Free preview flag
- Published status

## Setup Instructions

### 1. Database Setup
Run the migration file in your Supabase dashboard:
```sql
-- Run: migrations/courses-table.sql
```

This will create:
- courses table with all fields
- lessons table linked to courses
- course_enrollments table
- Necessary indexes for performance
- RLS policies for security

### 2. Environment Variables
No new environment variables are needed. The feature uses your existing Supabase configuration.

### 3. Navigation
The "Courses" link has been added to:
- Main navigation menu in [__root.tsx](src/routes/__root.tsx)
- Home page navigation cards in [index.tsx](src/routes/index.tsx)

## Usage Guide

### Creating a Course

1. Navigate to `/courses/admin`
2. Click "New Course" button
3. Fill in the required fields:
   - **Title**: Course name (auto-generates slug)
   - **Slug**: URL-friendly identifier
   - **Description**: Brief summary
   - **Content**: Full course description (supports rich text)
   - **Thumbnail**: Image URL (optional)
   - **Category**: Course category (e.g., "Web Development")
   - **Level**: beginner, intermediate, or advanced
   - **Duration**: Total course hours
   - **Technologies**: Tech stack covered
   - **Price**: 0 for free, or set a price
   - **Featured**: Highlight on listing page
   - **Published**: Make visible to users

4. Click "Create Course"

### Adding Lessons (Future Enhancement)
The lesson management system is in place. You can extend the admin interface to:
- Add lessons to a course
- Set lesson order
- Mark lessons as free previews
- Add video URLs for each lesson

### Managing Courses
From the admin dashboard you can:
- View all courses (published and drafts)
- Edit existing courses
- Delete courses
- Toggle publish status
- Set featured courses

## API Reference

### Course Functions (lib/course.ts)

```typescript
// Fetch published courses with pagination
await getPublishedCourses(page, pageSize);

// Get single course with lessons
await getCourseBySlug(slug);

// Create new course
await createCourse(courseData);

// Update existing course
await updateCourse(id, updateData);

// Delete course
await deleteCourse(id);

// Search courses
await searchCourses(query, page, pageSize);

// Filter by category
await getCoursesByCategory(category);

// Filter by level
await getCoursesByLevel('beginner' | 'intermediate' | 'advanced');
```

### Lesson Functions

```typescript
// Get lessons for a course
await getLessonsByCourse(courseId);

// Create lesson
await createLesson(lessonData);

// Update lesson
await updateLesson(id, updateData);

// Delete lesson
await deleteLesson(id);
```

### Enrollment Functions

```typescript
// Enroll user in course
await enrollInCourse({ course_id, user_email });

// Get user's enrollments
await getUserEnrollments(userEmail);

// Update progress
await updateEnrollment(courseId, userEmail, { progress: 75 });

// Get enrollment count
await getCourseEnrollmentCount(courseId);
```

## File Structure

```
src/
├── types/
│   └── course.ts                 # TypeScript interfaces
├── lib/
│   └── course.ts                 # Data layer functions
├── hooks/
│   └── useCourseQueries.ts       # React Query hooks
└── routes/
    ├── courses.tsx               # Layout component
    ├── courses.index.tsx         # Course listing
    ├── courses.$slug.tsx         # Course detail page
    └── courses.admin.tsx         # Admin dashboard

migrations/
└── courses-table.sql             # Database schema
```

## Styling

The courses feature uses your existing design system:
- Purple theme color scheme
- Responsive grid layouts
- Hover animations and transitions
- Dark mode support
- Tailwind CSS classes

## Future Enhancements

Consider adding:
1. **Lesson Player**: Video player component for lessons
2. **Progress Tracking**: Visual progress bars for enrolled students
3. **Certificates**: Generate completion certificates
4. **Reviews & Ratings**: Student feedback system
5. **Course Preview**: Free preview lessons
6. **Payment Integration**: Stripe/PayPal for paid courses
7. **Email Notifications**: Course updates and announcements
8. **Search & Filters**: Advanced search with multiple criteria
9. **Instructor Profiles**: Multi-instructor support
10. **Course Bundles**: Package multiple courses together

## Testing

To test the feature:
1. Start your dev server: `npm run dev`
2. Navigate to http://localhost:5173/courses
3. Click "Admin" to access the admin dashboard
4. Create a test course
5. View it on the courses listing page
6. Click on the course to see the detail page

## Security Notes

- RLS policies are in place but currently allow public read access to published courses
- Admin operations currently have no authentication (add authentication in production)
- Consider implementing role-based access control (RBAC)
- Add server-side validation for all inputs

## Support

For questions or issues:
- Check the Supabase dashboard for database errors
- Review browser console for client-side errors
- Verify all TypeScript types are correctly imported
- Ensure Supabase client is properly configured

---

**Built with**: React, TypeScript, TanStack Router, React Query, Supabase, Tailwind CSS
