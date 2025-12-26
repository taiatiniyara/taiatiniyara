import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL is not defined in environment variables');
}
export const tables = {
    blogPosts: 'blog_posts',
    courseCategories: 'course_categories',
    courses: 'courses',
    userProfiles: 'user_profiles',
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey!);
