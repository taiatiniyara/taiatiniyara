import { useEffect } from 'react';

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

const SITE_NAME = 'Taia Tiniyara';
const DEFAULT_TITLE = 'Taia Tiniyara - Software Engineering & Development in Fiji & the Pacific';
const DEFAULT_DESCRIPTION = 'Leading software engineering and development training in Fiji and the Pacific Islands. Expert software engineers, programmers, and developers offering comprehensive courses for Pacific professionals.';
const DEFAULT_IMAGE = 'https://taiatiniyara.com/og-image.jpg';
const BASE_URL = 'https://taiatiniyara.com';

export function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  canonicalUrl,
  author = 'Taia Tiniyara',
  publishedTime,
  modifiedTime,
  articleTags,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const finalOgTitle = ogTitle || title || DEFAULT_TITLE;
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
    updateMetaTag('meta[property="og:type"]', ogType);
    
    if (canonicalUrl) {
      updateMetaTag('meta[property="og:url"]', `${BASE_URL}${canonicalUrl}`);
    }

    // Update Twitter Card tags
    updateMetaTag('meta[property="twitter:title"]', finalOgTitle);
    updateMetaTag('meta[property="twitter:description"]', finalOgDescription);
    updateMetaTag('meta[property="twitter:image"]', ogImage);

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
      canonical.href = `${BASE_URL}${canonicalUrl}`;
    }

    // Cleanup function
    return () => {
      document.title = DEFAULT_TITLE;
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
