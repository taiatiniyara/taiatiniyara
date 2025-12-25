#!/usr/bin/env node

/**
 * Sitemap Generator Script
 * Generates sitemap.xml with all blog posts and projects from Supabase
 * 
 * Usage:
 *   node scripts/generate-sitemap.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local file
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    console.log('💡 Please create .env.local with:');
    console.log('   VITE_SUPABASE_URL=your-supabase-url');
    console.log('   VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-supabase-key');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return envVars;
}

const env = loadEnvFile();
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const BASE_URL = 'https://taiatiniyara.com';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function generateSitemap() {
  console.log('🚀 Generating sitemap...');
  
  const urls = [
    {
      loc: BASE_URL,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 1.0,
      image: {
        loc: `${BASE_URL}/taia.jpg`,
        title: 'Taia Tiniyara - Full-Stack Software Developer',
      },
    },
    {
      loc: `${BASE_URL}/about`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.9,
      image: {
        loc: `${BASE_URL}/taia.jpg`,
        title: 'Taia Tiniyara',
      },
    },
    {
      loc: `${BASE_URL}/blog`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: `${BASE_URL}/projects`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: `${BASE_URL}/courses`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.8,
    },
  ];

  // Fetch blog posts
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at, title, featured_image')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    if (posts) {
      console.log(`✅ Found ${posts.length} blog posts`);
      posts.forEach((post) => {
        const url = {
          loc: `${BASE_URL}/blog/${post.slug}`,
          lastmod: post.updated_at.split('T')[0],
          changefreq: 'monthly',
          priority: 0.7,
        };
        
        if (post.featured_image) {
          url.image = {
            loc: post.featured_image,
            title: post.title,
          };
        }
        
        urls.push(url);
      });
    }
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error.message);
  }

  // Fetch projects
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('slug, updated_at, published_at, title, thumbnail')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    if (projects) {
      console.log(`✅ Found ${projects.length} projects`);
      projects.forEach((project) => {
        const url = {
          loc: `${BASE_URL}/projects/${project.slug}`,
          lastmod: project.updated_at.split('T')[0],
          changefreq: 'monthly',
          priority: 0.7,
        };
        
        if (project.thumbnail) {
          url.image = {
            loc: project.thumbnail,
            title: project.title,
          };
        }
        
        urls.push(url);
      });
    }
  } catch (error) {
    console.error('❌ Error fetching projects:', error.message);
  }

  // Fetch courses
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('slug, updated_at, published_at, title, thumbnail')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    if (courses) {
      console.log(`✅ Found ${courses.length} courses`);
      courses.forEach((course) => {
        const url = {
          loc: `${BASE_URL}/courses/${course.slug}`,
          lastmod: course.updated_at.split('T')[0],
          changefreq: 'monthly',
          priority: 0.7,
        };
        
        if (course.thumbnail) {
          url.image = {
            loc: course.thumbnail,
            title: course.title,
          };
        }
        
        urls.push(url);
      });
    }
  } catch (error) {
    console.error('❌ Error fetching courses:', error.message);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map((url) => {
    let urlXml = `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>`;
    
    if (url.image) {
      urlXml += `
    <image:image>
      <image:loc>${url.image.loc}</image:loc>
      <image:title>${url.image.title || ''}</image:title>
    </image:image>`;
    }
    
    urlXml += `
  </url>`;
    
    return urlXml;
  })
  .join('\n')}
</urlset>`;

  // Write to file
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  
  console.log(`✅ Sitemap generated successfully!`);
  console.log(`📄 Total URLs: ${urls.length}`);
  console.log(`📁 Location: ${sitemapPath}`);
}

generateSitemap().catch(console.error);
