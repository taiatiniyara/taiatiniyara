import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  img_url: string;
  created_at: string;
  updated_at: string;
}

async function generateBlogPages() {
  console.log('🚀 Fetching blog posts from Supabase...');
  
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching blog posts:', error);
    return;
  }

  if (!posts || posts.length === 0) {
    console.log('⚠️  No blog posts found');
    return;
  }

  console.log(`📝 Found ${posts.length} blog posts`);

  const distDir = path.join(process.cwd(), 'dist', 'blog');
  
  // Create blog directory if it doesn't exist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Generate a static HTML page for each blog post
  for (const post of posts as BlogPost[]) {
    const html = generateBlogPostHTML(post);
    const postDir = path.join(distDir, post.slug);
    
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }
    
    const filePath = path.join(postDir, 'index.html');
    fs.writeFileSync(filePath, html);
    console.log(`✅ Generated: /blog/${post.slug}/index.html`);
  }

  console.log('🎉 Blog pages generated successfully!');
}

function generateBlogPostHTML(post: BlogPost): string {
  const siteUrl = 'https://taiatiniyara.com';
  const imageUrl = post.img_url || `${siteUrl}/og-image.jpg`;
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const publishedTime = new Date(post.created_at).toISOString();
  const modifiedTime = post.updated_at ? new Date(post.updated_at).toISOString() : publishedTime;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Primary Meta Tags -->
    <title>${post.title} | Taia Tiniyara</title>
    <meta name="title" content="${post.title}" />
    <meta name="description" content="${post.excerpt || post.title}" />
    <meta name="keywords" content="blog, ${post.title}, software development, programming" />
    <meta name="author" content="Taia Tiniyara" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${postUrl}" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${postUrl}" />
    <meta property="og:title" content="${post.title}" />
    <meta property="og:description" content="${post.excerpt || post.title}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${post.title}" />
    <meta property="og:site_name" content="Taia Tiniyara" />
    <meta property="og:locale" content="en_FJ" />
    
    <!-- Article Meta -->
    <meta property="article:published_time" content="${publishedTime}" />
    <meta property="article:modified_time" content="${modifiedTime}" />
    <meta property="article:author" content="Taia Tiniyara" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${postUrl}" />
    <meta property="twitter:title" content="${post.title}" />
    <meta property="twitter:description" content="${post.excerpt || post.title}" />
    <meta property="twitter:image" content="${imageUrl}" />
    <meta property="twitter:image:alt" content="${post.title}" />
    
    <!-- Redirect to the React app -->
    <script>
      // Redirect to the SPA after social media crawlers have read the meta tags
      if (!navigator.userAgent.includes('facebookexternalhit') && 
          !navigator.userAgent.includes('Twitterbot') &&
          !navigator.userAgent.includes('LinkedInBot')) {
        window.location.replace('${postUrl}');
      }
    </script>
    
    <!-- Fallback meta refresh for crawlers that execute JS -->
    <meta http-equiv="refresh" content="0;url=${postUrl}" />
  </head>
  <body>
    <h1>${post.title}</h1>
    <p>${post.excerpt || ''}</p>
    <p>If you are not redirected automatically, <a href="${postUrl}">click here</a>.</p>
  </body>
</html>`;
}

generateBlogPages().catch(console.error);
