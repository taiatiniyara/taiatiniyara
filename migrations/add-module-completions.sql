-- ============================================
-- MODULE COMPLETIONS TABLE
-- Track individual module completions
-- ============================================

CREATE TABLE IF NOT EXISTS module_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_module_completions_user_id ON module_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_module_completions_course_id ON module_completions(course_id);
CREATE INDEX IF NOT EXISTS idx_module_completions_module_id ON module_completions(module_id);

COMMENT ON TABLE module_completions IS 'Tracks which modules users have completed';
