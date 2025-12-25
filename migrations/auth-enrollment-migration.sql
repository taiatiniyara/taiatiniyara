-- Update Course Enrollments to use Supabase Auth
-- This migration updates the course_enrollments table to use user_id from auth.users

-- Step 1: Add user_id column if it doesn't exist
ALTER TABLE course_enrollments 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Add last_accessed_module_id for tracking progress
ALTER TABLE course_enrollments 
ADD COLUMN IF NOT EXISTS last_accessed_module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL;

-- Step 3: Create index for new user_id column
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON course_enrollments(user_id);

-- Step 4: Drop the old user_email constraint if it exists
ALTER TABLE course_enrollments 
DROP CONSTRAINT IF EXISTS course_enrollments_course_id_user_email_key;

-- Step 5: Add new unique constraint for course_id and user_id
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'course_enrollments_course_id_user_id_key'
  ) THEN
    ALTER TABLE course_enrollments 
    ADD CONSTRAINT course_enrollments_course_id_user_id_key 
    UNIQUE(course_id, user_id);
  END IF;
END $$;

-- Step 6: Update RLS Policies
DROP POLICY IF EXISTS "Users can view their enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Users can enroll in courses" ON course_enrollments;
DROP POLICY IF EXISTS "Users can update their enrollments" ON course_enrollments;

-- Policy: Users can view their own enrollments
CREATE POLICY "Users can view their own enrollments"
  ON course_enrollments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Authenticated users can enroll in courses
CREATE POLICY "Authenticated users can enroll in courses"
  ON course_enrollments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own enrollments
CREATE POLICY "Users can update their own enrollments"
  ON course_enrollments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Step 7: Add RLS policy for admins/public to view enrollment counts
CREATE POLICY "Anyone can view enrollment counts"
  ON course_enrollments
  FOR SELECT
  USING (true);

-- Step 8: Add is_free column to course_modules if it doesn't exist
ALTER TABLE course_modules 
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;

-- Step 9: Update module RLS policies to allow access to free modules or enrolled users
DROP POLICY IF EXISTS "Public can view published modules" ON course_modules;

CREATE POLICY "Public can view free published modules"
  ON course_modules
  FOR SELECT
  USING (
    published = true AND 
    is_free = true AND
    EXISTS (SELECT 1 FROM courses WHERE courses.id = course_modules.course_id AND courses.published = true)
  );

CREATE POLICY "Enrolled users can view all course modules"
  ON course_modules
  FOR SELECT
  USING (
    published = true AND
    EXISTS (
      SELECT 1 FROM course_enrollments 
      WHERE course_enrollments.course_id = course_modules.course_id 
      AND course_enrollments.user_id = auth.uid()
    )
  );

-- Step 10: Optional - If you want to migrate existing user_email data to user_id
-- This requires that you have users with matching emails in auth.users
-- Uncomment the following if you need to migrate existing data:
/*
UPDATE course_enrollments ce
SET user_id = au.id
FROM auth.users au
WHERE ce.user_email = au.email
AND ce.user_id IS NULL;
*/

-- Step 11: Make user_id NOT NULL after migration (optional, after data migration)
-- Uncomment after migrating existing data:
/*
ALTER TABLE course_enrollments 
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE course_enrollments 
DROP COLUMN user_email;
*/

COMMENT ON TABLE course_enrollments IS 'Tracks user course enrollments with auth integration';
COMMENT ON COLUMN course_enrollments.user_id IS 'Foreign key to auth.users - the enrolled user';
COMMENT ON COLUMN course_enrollments.last_accessed_module_id IS 'Tracks the last module the user accessed';
COMMENT ON COLUMN course_modules.is_free IS 'Whether the module is freely accessible without enrollment';
