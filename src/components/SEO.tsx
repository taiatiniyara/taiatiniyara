import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  noindex?: boolean;
}

export function SEO({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  publishedTime,
  modifiedTime,
  author = 'Taia Colai Tiniyara',
  tags = [],
  noindex = false,
}: SEOProps) {
  const fullTitle = title === 'Taia Tiniyara' ? title : `${title} | Taia Tiniyara`;
  const siteUrl = window.location.origin;
  const currentUrl = canonicalUrl || window.location.href;
  const defaultImage = `${siteUrl}/circle.svg`;
  const imageUrl = ogImage || defaultImage;

  useEffect(() => {
    // Set page title
    document.title = fullTitle;

    // Remove all existing meta tags we manage
    const metaSelectors = [
      'meta[name="description"]',
      'meta[name="author"]',
      'meta[name="keywords"]',
      'meta[name="robots"]',
      'link[rel="canonical"]',
      'meta[property^="og:"]',
      'meta[name^="twitter:"]',
      'meta[property^="article:"]',
    ];

    metaSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove());
    });

    // Create head element reference
    const head = document.head;

    // Basic meta tags
    const metaTags: Record<string, string> = {
      description,
      author,
    };

    if (tags.length > 0) {
      metaTags.keywords = tags.join(', ');
    }

    if (noindex) {
      metaTags.robots = 'noindex, nofollow';
    } else {
      metaTags.robots = 'index, follow';
    }

    Object.entries(metaTags).forEach(([name, content]) => {
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      head.appendChild(meta);
    });

    // Canonical URL
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = currentUrl;
    head.appendChild(canonical);

    // Open Graph tags
    const ogTags: Record<string, string> = {
      'og:title': title,
      'og:description': description,
      'og:type': ogType,
      'og:url': currentUrl,
      'og:image': imageUrl,
      'og:site_name': 'Taia Tiniyara',
      'og:locale': 'en_US',
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', property);
      meta.content = content;
      head.appendChild(meta);
    });

    // Article-specific tags
    if (ogType === 'article') {
      if (publishedTime) {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'article:published_time');
        meta.content = publishedTime;
        head.appendChild(meta);
      }

      if (modifiedTime) {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'article:modified_time');
        meta.content = modifiedTime;
        head.appendChild(meta);
      }

      if (author) {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'article:author');
        meta.content = author;
        head.appendChild(meta);
      }

      tags.forEach((tag) => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'article:tag');
        meta.content = tag;
        head.appendChild(meta);
      });
    }

    // Twitter Card tags
    const twitterTags: Record<string, string> = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': imageUrl,
      'twitter:creator': '@taiatiniyara',
      'twitter:site': '@taiatiniyara',
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      head.appendChild(meta);
    });
  }, [fullTitle, description, currentUrl, ogType, imageUrl, publishedTime, modifiedTime, author, tags, noindex]);

  return null;
}

interface StructuredDataProps {
  type: 'Person' | 'Article' | 'WebSite' | 'BlogPosting';
  data: Record<string, any>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    };

    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [type, data]);

  return null;
}
