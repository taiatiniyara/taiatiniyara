import { createClient } from '@supabase/supabase-js';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const SITE_URL = 'https://taiatiniyara.com';

export async function generateSitemap(): Promise<string> {
  // Get Supabase credentials from environment
  // When running in Node.js (tsx), use process.env
  // When running in browser/Vite, use import.meta.env
  const supabaseUrl = typeof process !== 'undefined' 
    ? process.env.VITE_SUPABASE_URL 
    : (import.meta as any).env?.VITE_SUPABASE_URL;
  
  const supabaseKey = typeof process !== 'undefined'
    ? (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY)
    : ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY);

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not found. Make sure .env.local file exists with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const urls: SitemapURL[] = [];

  // Static pages with high priority
  urls.push(
    {
      loc: `${SITE_URL}/`,
      changefreq: 'weekly',
      priority: 1.0,
    },
    {
      loc: `${SITE_URL}/about`,
      changefreq: 'monthly',
      priority: 0.9,
    },
    {
      loc: `${SITE_URL}/blog`,
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: `${SITE_URL}/projects`,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${SITE_URL}/courses`,
      changefreq: 'weekly',
      priority: 0.9,
    }
  );

  // Fetch blog posts
  try {
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (blogPosts) {
      blogPosts.forEach((post: { slug: string; created_at: string; updated_at?: string }) => {
        urls.push({
          loc: `${SITE_URL}/blog/${post.slug}`,
          lastmod: post.updated_at || post.created_at,
          changefreq: 'monthly',
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Fetch projects
  try {
    const { data: projects } = await supabase
      .from('projects')
      .select('slug, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (projects) {
      projects.forEach((project: { slug: string; created_at: string; updated_at?: string }) => {
        urls.push({
          loc: `${SITE_URL}/projects/${project.slug}`,
          lastmod: project.updated_at || project.created_at,
          changefreq: 'monthly',
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
  }

  // Fetch courses if they exist
  try {
    const { data: courses } = await supabase
      .from('courses')
      .select('slug, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (courses) {
      courses.forEach((course: { slug: string; created_at: string; updated_at?: string }) => {
        urls.push({
          loc: `${SITE_URL}/courses/${course.slug}`,
          lastmod: course.updated_at || course.created_at,
          changefreq: 'monthly',
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    // Courses table might not exist yet
    console.log('Courses table not found or error fetching courses');
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${new Date(url.lastmod).toISOString()}</lastmod>` : ''}${url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority ? `\n    <priority>${url.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return xml;
}

// Note: Run this script with tsx to generate sitemap
// Example: tsx src/lib/sitemap-generator.ts > public/sitemap.xml
