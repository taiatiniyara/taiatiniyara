# Supabase Authentication Setup for Courses Platform

This guide explains how to set up Supabase authentication for the courses platform enrollment system.

## Overview

The authentication system has been updated to use Supabase Auth instead of localStorage. Users can now:
- Sign up with email and password
- Sign in to access enrolled courses
- Reset their password
- View their course enrollments securely

## Prerequisites

1. A Supabase project
2. Supabase URL and anonymous key configured in `.env`
3. Email authentication enabled in Supabase

## Setup Steps

### 1. Configure Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
```

### 2. Enable Email Authentication in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Email** provider
4. Configure email templates (optional but recommended)

### 3. Run Database Migrations

Execute the authentication migration to update your database schema:

```bash
# Connect to your Supabase database and run:
psql -h your-db-host -U postgres -d postgres -f migrations/auth-enrollment-migration.sql
```

Or use the Supabase SQL Editor:
1. Go to **SQL Editor** in your Supabase Dashboard
2. Copy and paste the contents of `migrations/auth-enrollment-migration.sql`
3. Click **Run**

### 4. Update Email Templates (Optional)

Customize your authentication emails in Supabase:
1. Go to **Authentication** → **Email Templates**
2. Customize the following templates:
   - Confirm signup
   - Reset password
   - Magic link (optional)

## Key Changes

### Database Schema Updates

- **course_enrollments table**:
  - Added `user_id` column (references `auth.users`)
  - Added `last_accessed_module_id` for progress tracking
  - Updated unique constraint to use `user_id` instead of `user_email`
  - Updated RLS policies to use `auth.uid()`

- **course_modules table**:
  - Added `is_free` column to mark free preview modules
  - Updated RLS policies for free vs. enrolled access

### Application Updates

1. **AuthContext** (`src/contexts/AuthContext.tsx`):
   - Manages Supabase authentication state
   - Provides sign up, sign in, sign out, and password reset functions
   - Automatically syncs with Supabase auth state

2. **AuthModal Component** (`src/components/AuthModal.tsx`):
   - Unified authentication modal for login, signup, and password reset
   - Responsive design with form validation
   - Error handling and success messages

3. **Navigation Updates** (`src/routes/__root.tsx`):
   - Added authentication dropdown menu
   - Sign in/sign out functionality
   - User profile display

4. **Enrollment Flow** (`src/routes/courses.$slug.tsx`):
   - Updated to use authenticated user ID
   - Checks actual enrollment status from database
   - Shows auth modal when unauthenticated users try to enroll

## Usage

### For Users

1. **Sign Up**:
   - Click "Sign In" button in navigation
   - Switch to "Sign Up" mode
   - Enter email, password, and name
   - Check email for confirmation link
   - Click the confirmation link to activate account

2. **Sign In**:
   - Click "Sign In" button
   - Enter email and password
   - Access enrolled courses

3. **Enroll in Course**:
   - Browse to a course page
   - Click "Start Learning" button
   - Sign in if not authenticated
   - Automatically enrolled and redirected to first module

4. **Reset Password**:
   - Click "Sign In" button
   - Click "Forgot password?"
   - Enter email address
   - Check email for reset link
   - Click link and enter new password

### For Developers

#### Check Authentication Status

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <SignInPrompt />;
  
  return <div>Welcome, {user.email}!</div>;
}
```

#### Enroll User in Course

```typescript
import { useEnrollInCourse } from '@/hooks/useCourseQueries';
import { useAuth } from '@/contexts/AuthContext';

function EnrollButton({ courseId }) {
  const { user } = useAuth();
  const enrollMutation = useEnrollInCourse();
  
  const handleEnroll = async () => {
    await enrollMutation.mutateAsync({
      course_id: courseId,
      user_id: user.id,
    });
  };
  
  return <button onClick={handleEnroll}>Enroll</button>;
}
```

#### Check Enrollment Status

```typescript
import { useEnrollment } from '@/hooks/useCourseQueries';
import { useAuth } from '@/contexts/AuthContext';

function CourseAccess({ courseId }) {
  const { user } = useAuth();
  const { data: enrollment } = useEnrollment(courseId, user?.id || '');
  
  const isEnrolled = !!enrollment;
  
  return isEnrolled ? <CourseContent /> : <EnrollPrompt />;
}
```

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Courses**: Public can view published courses
- **Modules**: 
  - Public can view free published modules
  - Enrolled users can view all modules of enrolled courses
- **Enrollments**: 
  - Users can only view/modify their own enrollments
  - Anyone can view enrollment counts (for course popularity)

### Password Requirements

- Minimum 6 characters (configurable in Supabase)
- Passwords are hashed using bcrypt
- Password reset requires email verification

### Email Verification

- New users must verify their email before accessing courses
- Verification link sent automatically on signup
- Configurable in Supabase Auth settings

## Testing

### Test Authentication Flow

1. **Sign Up**:
   ```
   - Navigate to any course page
   - Click "Start Learning"
   - Click "Sign up" in the auth modal
   - Enter test email and password
   - Check inbox for confirmation email
   ```

2. **Sign In**:
   ```
   - Click "Sign In" in navigation
   - Enter credentials
   - Verify redirect to dashboard or previous page
   ```

3. **Enrollment**:
   ```
   - Sign in as test user
   - Go to course page
   - Click "Start Learning"
   - Verify enrollment in database
   - Verify access to course modules
   ```

## Troubleshooting

### "User not found" Error

- Ensure user has confirmed their email
- Check that email provider is enabled in Supabase
- Verify user exists in `auth.users` table

### "RLS Policy Violation" Error

- Check that RLS policies are properly set up
- Verify user is authenticated (`auth.uid()` returns value)
- Ensure user_id in enrollment matches authenticated user

### Email Not Sending

- Verify email provider is configured in Supabase
- Check email templates are set up
- Review Supabase email logs
- Ensure SMTP settings are correct (for custom domains)

### Cannot Access Enrolled Courses

- Verify enrollment exists in `course_enrollments` table
- Check RLS policies on `course_modules`
- Ensure `user_id` in enrollment matches `auth.uid()`

## Migration from Old System

If you have existing data with `user_email`:

1. Ensure all users have accounts in `auth.users` with matching emails
2. Run the migration script with the commented section uncommented
3. Test thoroughly before dropping `user_email` column
4. Make `user_id` NOT NULL after successful migration

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Password Requirements](https://supabase.com/docs/guides/auth/passwords)

## Support

For issues or questions:
1. Check Supabase Dashboard logs
2. Review browser console for errors
3. Verify environment variables are set correctly
4. Check that migrations ran successfully
