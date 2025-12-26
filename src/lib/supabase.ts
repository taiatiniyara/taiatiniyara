import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL is not defined in environment variables');
}
export const tables = {
    blog_posts: 'blog_posts',
    course_categories: 'course_categories',
    courses: 'courses',
    user_profiles: 'user_profiles',
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey!);
