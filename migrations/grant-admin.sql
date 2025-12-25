-- ============================================
-- GRANT ADMIN ACCESS
-- Run this in Supabase SQL Editor after signing up
-- ============================================

-- Check current user profile
SELECT id, email, role, created_at 
FROM user_profiles 
WHERE email = 'taiatiniyara@gmail.com';

-- Grant admin role
UPDATE user_profiles 
SET role = 'admin', updated_at = NOW()
WHERE email = 'taiatiniyara@gmail.com';

-- Verify admin role was granted
SELECT id, email, role, created_at, updated_at
FROM user_profiles 
WHERE email = 'taiatiniyara@gmail.com';
