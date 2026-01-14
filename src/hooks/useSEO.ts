import { useEffect } from 'react';
import { SITE_CONFIG } from '@/lib/constants';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  canonicalUrl?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleTags?: string[];
}

export function useSEO({
  title,
  description = SITE_CONFIG.description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage = SITE_CONFIG.defaultImage,
  ogType = 'website',
  canonicalUrl,
  author = SITE_CONFIG.author,
  publishedTime,
  modifiedTime,
  articleTags,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.title;
    const finalOgTitle = ogTitle || title || SITE_CONFIG.title;
    const finalOgDescription = ogDescription || description;

    // Update title
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, content: string, attribute: string = 'content') => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const selectorParts = selector.match(/\[([^=]+)="([^"]+)"\]/);
        if (selectorParts) {
          element.setAttribute(selectorParts[1], selectorParts[2]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, content);
    };

    // Update basic meta tags
    updateMetaTag('meta[name="title"]', fullTitle);
    updateMetaTag('meta[name="description"]', description);
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', keywords);
    }
    updateMetaTag('meta[name="author"]', author);

    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', finalOgTitle);
    updateMetaTag('meta[property="og:description"]', finalOgDescription);
    updateMetaTag('meta[property="og:image"]', ogImage);
    updateMetaTag('meta[property="og:image:width"]', '1200');
    updateMetaTag('meta[property="og:image:height"]', '630');
    updateMetaTag('meta[property="og:image:alt"]', finalOgTitle);
    updateMetaTag('meta[property="og:type"]', ogType);
    updateMetaTag('meta[property="og:site_name"]', SITE_CONFIG.name);
    
    if (canonicalUrl) {
      updateMetaTag('meta[property="og:url"]', `${SITE_CONFIG.baseUrl}${canonicalUrl}`);
    }

    // Update Twitter Card tags
    updateMetaTag('meta[property="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[property="twitter:title"]', finalOgTitle);
    updateMetaTag('meta[property="twitter:description"]', finalOgDescription);
    updateMetaTag('meta[property="twitter:image"]', ogImage);
    updateMetaTag('meta[property="twitter:image:alt"]', finalOgTitle);

    // Article-specific meta tags
    if (ogType === 'article') {
      if (publishedTime) {
        updateMetaTag('meta[property="article:published_time"]', publishedTime);
      }
      if (modifiedTime) {
        updateMetaTag('meta[property="article:modified_time"]', modifiedTime);
      }
      if (author) {
        updateMetaTag('meta[property="article:author"]', author);
      }
      if (articleTags) {
        // Remove existing article:tag tags
        document.querySelectorAll('meta[property="article:tag"]').forEach(tag => tag.remove());
        // Add new tags
        articleTags.forEach(tag => {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'article:tag');
          meta.setAttribute('content', tag);
          document.head.appendChild(meta);
        });
      }
    }

    // Update canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.href = `${SITE_CONFIG.baseUrl}${canonicalUrl}`;
    }

    // Cleanup function
    return () => {
      document.title = SITE_CONFIG.title;
    };
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    canonicalUrl,
    author,
    publishedTime,
    modifiedTime,
    articleTags,
  ]);
}

// Helper function to generate structured data script
export function createStructuredData(data: Record<string, unknown>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    ...data,
  });
}
