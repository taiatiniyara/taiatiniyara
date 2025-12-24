/**
 * Utility to generate sitemap.xml dynamically
 * Run this script after deploying to update the sitemap with all blog posts and projects
 */

import { supabase } from './supabase';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  image?: {
    loc: string;
    title?: string;
    caption?: string;
  };
}

export async function generateSitemap(baseUrl: string): Promise<string> {
  const urls: SitemapUrl[] = [
    {
      loc: baseUrl,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 1.0,
      image: {
        loc: `${baseUrl}/taia.jpg`,
        title: 'Taia Tiniyara - Full-Stack Software Developer',
      },
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.9,
      image: {
        loc: `${baseUrl}/taia.jpg`,
        title: 'Taia Tiniyara',
      },
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/projects`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.8,
    },
  ];

  // Fetch all published blog posts
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at, title, featured_image')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (!error && posts) {
      posts.forEach((post) => {
        const url: SitemapUrl = {
          loc: `${baseUrl}/blog/${post.slug}`,
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
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Fetch all published projects
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('slug, updated_at, published_at, title, thumbnail')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (!error && projects) {
      projects.forEach((project) => {
        const url: SitemapUrl = {
          loc: `${baseUrl}/projects/${project.slug}`,
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
    console.error('Error fetching projects for sitemap:', error);
  }

  // Generate XML with image support
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
      <image:title>${url.image.title || ''}</image:title>${url.image.caption ? `
      <image:caption>${url.image.caption}</image:caption>` : ''}
    </image:image>`;
    }
    
    urlXml += `
  </url>`;
    
    return urlXml;
  })
  .join('\n')}
</urlset>`;

  return xml;
}

// CLI script to generate and save sitemap
export async function saveSitemap() {
  const sitemap = await generateSitemap('https://taia.blog');
  
  // You can write this to a file or return it
  return sitemap;
}

// Example usage in Node.js:
// import { saveSitemap } from './sitemap';
// import fs from 'fs';
// saveSitemap().then(xml => {
//   fs.writeFileSync('public/sitemap.xml', xml);
//   console.log('Sitemap generated successfully!');
// });
