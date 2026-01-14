# Courses System - Quick Reference Guide

## 🚀 Quick Start

### For Administrators

#### Create a Course
1. Go to `/admin/courses`
2. Click "Create Course"
3. Fill in: category, title, description, technologies, tags, image URL
4. Submit

#### Add Lessons to a Course
1. Go to `/admin/courses`
2. Click "Manage Lessons" on the course card
3. Click "Create Lesson"
4. Fill in: title, duration (minutes), content (rich text)
5. Use TipTap editor features:
   - Basic formatting (Bold, Italic, Strikethrough, Code)
   - Headings (H1, H2, H3)
   - Lists (Bullet and Ordered)
   - Blockquotes
   - Images (via URL)
   - **Code Blocks** with syntax highlighting
   - **HTML Source** editing mode
6. Submit

### For Students

#### Enroll in a Course
1. Browse courses at `/courses`
2. Click on a course to view details
3. Click "Enroll in Course"
4. Access lessons from course page

#### Track Your Progress
1. Go to `/student/courses` to see enrolled courses
2. View progress bars and completion percentages
3. Click on a course to access lessons
4. Complete lessons and click "Mark as Complete"
5. Progress updates automatically in real-time

---

## 📍 Routes Reference

### Public Routes
| Route | Description |
|-------|-------------|
| `/courses` | Browse all available courses |
| `/courses/$slug` | View course details with lessons list |
| `/courses/$courseSlug/$lessonSlug` | View lesson content and mark complete |

### Student Routes (Protected)
| Route | Description |
|-------|-------------|
| `/student/courses` | View enrolled courses with progress tracking |

### Admin Routes (Protected)
| Route | Description |
|-------|-------------|
| `/admin/courses` | Manage all courses and categories |
| `/admin/courses/$courseSlug/lessons` | Manage lessons for a specific course |

---

## 🎯 Key Features

### ✅ Course Management
- Create/Edit/Delete courses
- Add images and descriptions
- Tag with technologies
- Organize by categories
- Difficulty levels

### ✅ Lesson Management
- Create/Edit/Delete lessons
- **Enhanced TipTap rich text editor:**
  - Text formatting (Bold, Italic, Strikethrough, Inline Code)
  - Headings (H1, H2, H3)
  - Lists (Bullet and Ordered)
  - Blockquotes
  - Images
  - **Code Blocks** with syntax highlighting
  - **HTML Source** editing mode
- Set duration in minutes
- Auto-generated slugs
- Curriculum navigation

### ✅ Enrollment System
- One-click enrollment
- Enrollment status tracking
- Requires authentication
- Real-time enrollment updates

### ✅ Progress Tracking
- Mark lessons complete
- Track completion timestamps
- Calculate progress percentage
- Show completed/total lessons
- Progress bars
- Real-time updates

---

## 🛠️ Custom Hooks

```typescript
// Enrollment management
const { enrollInCourse, isEnrolling } = useEnrollment();
await enrollInCourse(courseId);

// Track lesson completion
const { markAsComplete, isUpdating } = useProgressTracking(enrollmentId);
await markAsComplete(lessonId);

// Get overall course progress
const { data: progress, isLoading } = useCourseProgress(courseId);
// Returns: { completedLessons: number, totalLessons: number, percentage: number }
```

---

## 🎨 Components

### Enrollment
```tsx
<EnrollButton courseId={course.id} courseTitle={course.title} />
```

### Lesson Forms
```tsx
<CreateLessonForm courseId={courseId} />
<EditLessonForm lessonId={lessonId} />
```

### Course Forms
```tsx
<CreateCourseForm />
<EditCourseForm courseId={courseId} />
```

---

## 💡 Tips

### For Content Creators
- Use descriptive lesson titles
- Estimate realistic durations (in minutes)
- Use TipTap editor features:
  - Code blocks for programming tutorials
  - HTML source for advanced formatting
  - Headings for structured content
  - Images to enhance understanding
- Add relevant technologies and tags for discoverability
- Organize courses into appropriate categories

### For Students
- Browse courses by category or technology
- Complete lessons in order
- Mark lessons complete as you finish them
- Check progress regularly at `/student/courses`
- Use breadcrumb navigation for easy movement

### For Developers
- All hooks use TanStack Query for caching
- Components are fully typed with TypeScript
- Toast notifications via Sonner
- Direct Supabase calls for mutations
- Route naming: Use underscore in filename for pathless routes
- TipTap packages: `@tiptap/extension-code-block-lowlight` and `lowlight`

---

## 🔧 Technical Details

### Database Tables
- `courses` - Course information
- `course_categories` - Category organization
- `lessons` - Lesson content and metadata
- `enrollments` - Student course enrollments
- `progress_tracking` - Lesson completion tracking

### Key Technologies
- **TipTap Editor**: Rich text editing with extensions
  - StarterKit (with codeBlock disabled)
  - CodeBlockLowlight (syntax highlighting)
  - Heading, Image, Document, Paragraph, Text
- **Lowlight**: Syntax highlighting for code blocks
- **Supabase**: Backend and database
- **TanStack Query**: Data synchronization and caching
- **TanStack Router**: File-based routing

---

## 🔗 Related Documentation

- [Full Courses Documentation](./COURSES_README.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Authentication Guide](./AUTH_README.md)
- [Main README](../README.md)

---

**Quick Access Links:**
- Browse Courses: `/courses`
- My Courses: `/student/courses`
- Admin Panel: `/admin/courses`
- Student Dashboard: `/student`

---

**Last Updated:** January 14, 2026  
**Status:** Production Ready ✅
