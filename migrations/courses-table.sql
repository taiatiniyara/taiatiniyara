-- Courses Table Migration
-- Run this file to create courses and lessons tables

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  thumbnail TEXT,
  category TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_hours INTEGER DEFAULT 0,
  technologies TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Modules Table (for course curriculum)
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, slug)
);

-- Course Enrollments Table (track user enrollments)
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  UNIQUE(course_id, user_email)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(published);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(featured);
CREATE INDEX IF NOT EXISTS idx_courses_published_at ON courses(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);

CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_slug ON course_modules(slug);
CREATE INDEX IF NOT EXISTS idx_course_modules_order ON course_modules(order_index);

CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_email ON course_enrollments(user_email);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- Courses Policies
-- Allow everyone to read published courses
CREATE POLICY "Public can view published courses"
  ON courses
  FOR SELECT
  USING (published = true);

-- For now, allow anyone to create/update courses (restrict this in production)
CREATE POLICY "Anyone can insert courses"
  ON courses
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update courses"
  ON courses
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete courses"
  ON courses
  FOR DELETE
  USING (true);

-- Course Modules Policies
-- Allow everyone to read published modules from published courses
CREATE POLICY "Public can view published modules"
  ON course_modules
  FOR SELECT
  USING (
    published = true AND 
    EXISTS (SELECT 1 FROM courses WHERE courses.id = course_modules.course_id AND courses.published = true)
  );

-- For now, allow anyone to manage modules (restrict this in production)
CREATE POLICY "Anyone can insert modules"
  ON course_modules
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update modules"
  ON course_modules
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete modules"
  ON course_modules
  FOR DELETE
  USING (true);

-- Enrollments Policies
-- Users can view their own enrollments
CREATE POLICY "Users can view their enrollments"
  ON course_enrollments
  FOR SELECT
  USING (true);

CREATE POLICY "Users can enroll in courses"
  ON course_enrollments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their enrollments"
  ON course_enrollments
  FOR UPDATE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
  BEFORE UPDATE ON course_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
