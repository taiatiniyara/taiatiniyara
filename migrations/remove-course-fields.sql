-- Migration: Remove content and duration_hours columns from courses table
-- Date: December 25, 2025
-- Description: These fields are no longer needed. Content lives in modules,
--              and duration is calculated from module durations.

-- Remove content column (if exists)
ALTER TABLE courses DROP COLUMN IF EXISTS content;

-- Remove duration_hours column (if exists)
ALTER TABLE courses DROP COLUMN IF EXISTS duration_hours;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'courses' 
ORDER BY ordinal_position;
