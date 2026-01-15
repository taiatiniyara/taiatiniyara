# Course Management System Documentation

## Overview

The Course Management System is a comprehensive learning platform that allows administrators to create and manage courses, lessons, and categories, while providing students with an engaging learning experience including progress tracking, enrollments, and course reviews.

**Status:** Production Ready ✅  
**Last Updated:** January 15, 2026  
**Build Status:** Successfully tested and operational

## Features

### 🎓 For Students
- **Browse Courses** - Explore available courses with filtering by category, technology, and tags
- **Course Enrollment** - Enroll in courses to start learning
- **Lesson Access** - Access course lessons with rich content
- **Progress Tracking** - Track completion status for each lesson
- **Course Reviews** - Rate and review completed courses
- **Student Dashboard** - View all enrolled courses and progress

### 👨‍💼 For Administrators
- **Course Management** - Full CRUD operations for courses
- **Category Management** - Organize courses by categories with difficulty levels
- **Lesson Management** - Create and edit lessons within courses
- **Content Editor** - Rich text editor (TipTap) for lesson content
- **Image Management** - Upload and manage course thumbnails
- **Tag Management** - Add technologies and tags for better discovery

## Database Schema

### Tables

#### `course_categories`
Organizes courses into categories with difficulty levels.

```typescript
{
  id: uuid (primary key)
  name: string
  description: string
  level: "Beginner" | "Intermediate" | "Advanced"
  created_at: timestamp
  updated_at: timestamp
}
```

#### `courses`
Main course information.

```typescript
{
  id: uuid (primary key)
  category_id: uuid (foreign key → course_categories)
  slug: string (unique)
  title: string
  img_url: string (optional)
  tags: string[]
  technologies: string[]
  description: string
  created_at: timestamp
  updated_at: timestamp
}
```

#### `lessons`
Individual lessons within courses.

```typescript
{
  id: uuid (primary key)
  course_id: uuid (foreign key → courses)
  slug: string (unique)
  title: string
  content: text (HTML from TipTap editor)
  duration_minutes: integer
  created_at: timestamp
  updated_at: timestamp
}
```

#### `enrollments`
Student course enrollments.

```typescript
{
  id: uuid (primary key)
  user_id: uuid (foreign key → user_profiles)
  course_id: uuid (foreign key → courses)
  enrolled_at: timestamp
  review: string (optional)
  rating: integer (optional, 1-5)
  updated_at: timestamp
}
```

#### `progress_tracking`
Tracks lesson completion per student.

```typescript
{
  id: uuid (primary key)
  enrollment_id: uuid (foreign key → enrollments)
  lesson_id: uuid (foreign key → lessons)
  is_completed: boolean
  completed_at: timestamp (optional)
  updated_at: timestamp
}
```

## File Structure

```
src/
├── components/
│   └── courses/
│       ├── createCourse.tsx            # Course creation form
│       ├── editCourse.tsx              # Course editing form
│       ├── createCourseCategory.tsx    # Category creation form
│       ├── editCourseCategory.tsx      # Category editing form
│       ├── createLesson.tsx            # Lesson creation form
│       ├── editLesson.tsx              # Lesson editing form
│       └── enrollButton.tsx            # Enrollment button component
├── hooks/
│   ├── useEnrollment.ts                # Enrollment management hook
│   ├── useProgressTracking.ts          # Progress tracking hook
│   └── useCourseProgress.ts            # Course progress data hook
├── routes/
│   ├── courses/
│   │   ├── index.tsx                   # Course listing page
│   │   ├── $slug.tsx                   # Course detail page with lessons
│   │   └── $courseSlug.$lessonSlug.tsx # Lesson detail page
│   ├── admin.courses.tsx               # Admin course management
│   ├── admin.courses_.$courseSlug.lessons.tsx  # Admin lesson management
│   └── student/
│       └── courses.tsx                 # Student dashboard with progress
└── lib/
    └── drizzle/
        └── schema.ts                   # Database schema definitions
```

## Usage Guide

### Creating a Course (Admin)

1. Navigate to `/admin/courses`
2. Click "Create Course" button
3. Fill in the form:
   - Select a category
   - Enter course title (slug auto-generated)
   - Add description
   - Add technologies as tags
   - Add general tags
   - Provide image URL
4. Submit the form

### Creating Course Categories (Admin)

1. Navigate to `/admin/courses`
2. Click on "Create Category" option
3. Fill in:
   - Category name
   - Description
   - Difficulty level (Beginner/Intermediate/Advanced)
4. Submit

### Managing Lessons (Admin)

1. Navigate to `/admin/courses`
2. Click "Manage Lessons" button for any course
3. View all lessons for that course
4. **Create New Lesson:**
   - Click "Create Lesson" button
   - Fill in the form:
     - Lesson title (slug auto-generated)
     - Duration in minutes
     - Content using TipTap rich text editor with:
       - Text formatting (Bold, Italic, Strikethrough, Inline Code)
       - Headings (H1, H2, H3)
       - Lists (Bullet and Ordered)
       - Blockquotes
       - Images
       - **Code Blocks** with syntax highlighting
       - **HTML Source** editing mode for advanced users
   - Submit the form
5. **Edit Lesson:**
   - Click "Edit" on any lesson card
   - Modify lesson details
   - Use TipTap editor to update content
   - Save changes
6. **Delete Lesson:**
   - Click "Delete" on any lesson card
   - Confirm deletion

### TipTap Editor Features

The rich text editor provides:
- **Basic Formatting:** Bold, Italic, Strikethrough, Inline Code
- **Headings:** H1, H2, H3
- **Lists:** Bullet lists and numbered lists
- **Blockquotes:** For highlighting important information
- **Images:** Insert images via URL
- **Code Blocks:** Multi-line code with syntax highlighting (using Lowlight)
- **HTML Source:** Toggle to HTML source mode for direct HTML editing
- **Undo/Redo:** Full history management

### Student Enrollment Flow

1. Student browses courses at `/courses`
2. Clicks on a course to view details
3. Clicks "Enroll" button on course detail page
4. Course is added to student's enrolled courses
5. Lessons become accessible from the course page
6. Student can start learning and marking lessons as complete
7. Progress is tracked automatically

### Viewing Course Details

Students and visitors can:
1. Browse courses at `/courses`
2. Click on any course card
3. View full course description
4. See technologies and tags
5. (If enrolled) Access lessons and track progress

## Custom Hooks

### `useSupabaseQuery`
Fetches data from Supabase with TanStack Query integration.

```typescript
const { data, error, isLoading } = useSupabaseQuery<Course>({
  queryKey: ["courses"],
  tableName: "courses",
  fields: ["id", "title", "description", "slug"],
  enabled: true, // Optional: control when query runs
});
```

### `useEnrollment`
Manages course enrollment for students.

```typescript
const { enrollInCourse, isEnrolling } = useEnrollment();

// Enroll in a course
await enrollInCourse(courseId);
```

### `useProgressTracking`
Tracks lesson completion and progress.

```typescript
const { markAsComplete, isUpdating } = useProgressTracking(enrollmentId);

// Mark a lesson as complete
await markAsComplete(lessonId);
```

### `useCourseProgress`
Fetches course progress data for a student.

```typescript
const { data: progress, isLoading } = useCourseProgress(courseId);
// Returns: { completedLessons: number, totalLessons: number, percentage: number }
```

## Components

### Reusable Components

#### `ContentListPage`
Generic component for displaying lists of content with loading and error states.

#### `ContentCard`
Displays course information in a card format with image, title, and description.

#### `DetailPageLayout`
Layout wrapper for detail pages with consistent styling.

### Form Components

#### `CreateForm<T>`
Generic form component for creating new records with type safety.

#### `EditForm<T>`
Generic form component for editing existing records.

## Routing

### Public Routes
- `/courses` - Browse all courses
- `/courses/$slug` - View individual course details with lesson list
- `/courses/$courseSlug/$lessonSlug` - View lesson detail page with content

### Protected Routes (Admin)
- `/admin/courses` - Manage courses and categories
- `/admin/courses/$courseSlug/lessons` - Manage lessons for a specific course

### Protected Routes (Student)
- `/student/courses` - Student dashboard with enrolled courses and progress

## Implemented Features ✅

### Core Course Management
- ✅ Course CRUD operations
- ✅ Category management with difficulty levels
- ✅ Lesson CRUD operations
- ✅ Rich text editor (TipTap) with enhanced features:
  - Text formatting (Bold, Italic, Strikethrough, Code)
  - Headings (H1, H2, H3)
  - Lists (Bullet and Ordered)
  - Blockquotes
  - Images
  - **Code Blocks** with syntax highlighting
  - **HTML Source** editing mode
- ✅ Image URL support for course thumbnails
- ✅ Technology and tag management

### Student Features
- ✅ Course browsing and filtering
- ✅ Course enrollment system
- ✅ Lesson access for enrolled courses
- ✅ Progress tracking per lesson
- ✅ "Mark as Complete" functionality
- ✅ Student dashboard with progress visualization
- ✅ Course completion percentage display

### Admin Features
- ✅ Course management interface
- ✅ Category management interface
- ✅ Lesson management interface
- ✅ Create/Edit/Delete operations for all entities
- ✅ Rich content editing with TipTap

## Future Enhancements 🚀

### High Priority

1. **Course Reviews & Ratings**
   - Add review submission form
   - Display ratings on course cards
   - Show reviews on course detail page
   - Calculate average ratings

2. **Lesson Ordering**
   - Implement drag-and-drop lesson reordering
   - Add "order" field to lessons table
   - Display lessons in order on course page

3. **Video Support**
   - Add video embedding in TipTap editor
   - Support YouTube, Vimeo, and direct video links
   - Video player with progress tracking

4. **Downloadable Resources**
   - Allow attaching files to lessons
   - PDF, code files, and other resources
   - File upload and management

### Medium Priority

5. **Course Reviews**
   - [ ] Create review form component
   - [ ] Display reviews on course page
   - [ ] Show average rating
   - [ ] Add rating stars component

6. **Lesson Prerequisites**
   - [ ] Add prerequisite field to lessons
   - [ ] Lock lessons until prerequisites completed
   - [ ] Show locked/unlocked status

7. **Course Filtering**
   - [ ] Add filter by category
   - [ ] Add filter by technology
   - [ ] Add filter by difficulty level
   - [ ] Add search functionality

### Low Priority

8. **Course Analytics**
   - [ ] Show enrollment count
   - [ ] Display completion rates
   - [ ] Track time spent per lesson
   - [ ] Generate completion certificates

9. **Discussion Forums**
   - [ ] Add comments to lessons
   - [ ] Create Q&A section
   - [ ] Allow student discussions

## API Examples

### Fetching Courses

```typescript
// Get all courses
const { data: courses } = useSupabaseQuery<Course>({
  queryKey: ["courses"],
  tableName: "courses",
  fields: ["id", "title", "img_url", "description", "slug"],
});

// Get single course by slug
const { data } = useSupabaseQuery<Course>({
  queryKey: [`courses/${slug}`],
  tableName: "courses",
  params: { name: "slug", value: slug },
});
```

### Creating a Course

```typescript
const { create } = useSupabaseCreate({
  tableName: "courses",
  invalidateQueries: ["courses"],
});

await create({
  category_id: "uuid-here",
  title: "Introduction to React",
  slug: "intro-to-react",
  description: "Learn React from scratch",
  technologies: ["React", "JavaScript"],
  tags: ["Web Development", "Frontend"],
  img_url: "https://example.com/image.jpg",
});
```

### Enrolling in a Course

```typescript
// To be implemented
const { create } = useSupabaseCreate({
  tableName: "enrollments",
  invalidateQueries: ["enrollments", "my-courses"],
});

await create({
  user_id: user.id,
  course_id: course.id,
  enrolled_at: new Date(),
});
```

### Tracking Progress

```typescript
// To be implemented
const { create } = useSupabaseCreate({
  tableName: "progress_tracking",
  invalidateQueries: ["progress", `course-progress-${courseId}`],
});

await create({
  enrollment_id: enrollmentId,
  lesson_id: lessonId,
  is_completed: true,
  completed_at: new Date(),
});
```

## Best Practices

### When Creating Courses
- Use descriptive, SEO-friendly titles
- Write clear, engaging descriptions
- Add relevant technologies and tags
- Use high-quality images
- Organize courses into appropriate categories

### When Creating Lessons
- Break content into digestible chunks
- Estimate realistic duration times
- Use rich formatting in TipTap editor
- Include code examples where relevant
- Add clear learning objectives

### For Students
- Complete lessons in order
- Mark lessons as complete
- Leave reviews after course completion
- Track your progress regularly

## Troubleshooting

### Common Issues

**Course not appearing in list**
- Check if `is_published` flag needs to be added (future feature)
- Verify category exists and is valid
- Check database connection

**Images not loading**
- Verify image URL is accessible
- Check CORS settings
- Ensure URL is properly formatted

**Enrollment not working**
- Verify user is authenticated
- Check enrollment table permissions in Supabase
- Ensure course ID is valid

## Security Considerations

- All course mutations require authentication
- Admin routes protected by role check
- Student can only modify their own progress
- Course content accessible only to enrolled students (to be implemented)
- Input validation on all forms

## Future Enhancements

- Video lesson support
- Downloadable resources
- Quiz and assessment system
- Course certificates
- Live coding environments
- Peer code reviews
- Course recommendations
- Learning paths
- Social features (study groups)

## Related Documentation

- [Authentication System](./AUTH_README.md)
- [SEO Guide](./SEO_GUIDE.md)
- [Main README](../README.md)

---

**Last Updated:** January 14, 2026  
**Status:** Production Ready ✅
