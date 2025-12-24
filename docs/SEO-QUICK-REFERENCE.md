# Quick SEO Reference Guide

## 🚀 Quick Start

### Generate Sitemap
Before deploying, always generate a fresh sitemap:
```bash
npm run generate-sitemap
```

Or it will run automatically before deploy:
```bash
npm run deploy
```

---

## 📝 Adding SEO to New Pages

### Basic Page SEO
```tsx
import { SEO, StructuredData } from '@/components/SEO';

function MyPage() {
  return (
    <>
      <SEO
        title="Page Title"
        description="Page description under 160 characters"
        canonicalUrl={window.location.href}
        ogImageAlt="Descriptive alt text"
      />
      {/* Your page content */}
    </>
  );
}
```

### Blog Post SEO
```tsx
<SEO
  title={post.title}
  description={excerpt}
  canonicalUrl={postUrl}
  ogType="article"
  ogImage={post.featured_image}
  ogImageAlt={post.title}
  publishedTime={post.published_at}
  modifiedTime={post.updated_at}
  tags={post.tags}
/>
<StructuredData
  type="BlogPosting"
  data={{
    headline: post.title,
    description: excerpt,
    image: post.featured_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: 'Taia Colai Tiniyara' },
  }}
/>
<StructuredData
  type="BreadcrumbList"
  data={{
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  }}
/>
```

---

## 🔍 SEO Component Props

### SEO Component
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | ✅ | Page title (50-60 chars) |
| `description` | string | ✅ | Meta description (150-160 chars) |
| `canonicalUrl` | string | ❌ | Canonical URL (defaults to current) |
| `ogType` | 'website' \| 'article' | ❌ | Open Graph type (default: 'website') |
| `ogImage` | string | ❌ | OG image URL (1200x630 recommended) |
| `ogImageWidth` | string | ❌ | Image width (default: '1200') |
| `ogImageHeight` | string | ❌ | Image height (default: '630') |
| `ogImageAlt` | string | ❌ | Image alt text (accessibility) |
| `publishedTime` | string | ❌ | ISO date for articles |
| `modifiedTime` | string | ❌ | ISO date for last update |
| `author` | string | ❌ | Author name (default: 'Taia Colai Tiniyara') |
| `tags` | string[] | ❌ | Keywords/tags array |
| `noindex` | boolean | ❌ | Prevent indexing (default: false) |

### StructuredData Component
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | 'Person' \| 'Article' \| 'WebSite' \| 'BlogPosting' \| 'Organization' \| 'BreadcrumbList' | ✅ | Schema type |
| `data` | object | ✅ | Schema.org data object |

---

## 📊 Common Structured Data Patterns

### Person Schema
```tsx
<StructuredData
  type="Person"
  data={{
    name: 'Taia Colai Tiniyara',
    jobTitle: 'Full-Stack Software Developer',
    url: window.location.origin,
    email: 'taiatiniyara@gmail.com',
    knowsAbout: ['React', 'TypeScript', 'Python'],
    sameAs: ['https://github.com/taiatiniyara'],
  }}
/>
```

### Organization Schema
```tsx
<StructuredData
  type="Organization"
  data={{
    name: 'Taia Tiniyara',
    url: window.location.origin,
    logo: `${window.location.origin}/logo.svg`,
    sameAs: ['https://github.com/taiatiniyara'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+679 986 0831',
      contactType: 'Professional',
    },
  }}
/>
```

### BreadcrumbList Schema
```tsx
<StructuredData
  type="BreadcrumbList"
  data={{
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Section', item: sectionUrl },
      { '@type': 'ListItem', position: 3, name: 'Page', item: pageUrl },
    ],
  }}
/>
```

---

## ✅ SEO Checklist for New Content

### Before Publishing
- [ ] Title is 50-60 characters
- [ ] Description is 150-160 characters
- [ ] Featured image is 1200x630px
- [ ] Image has descriptive alt text
- [ ] URL slug is SEO-friendly (lowercase, hyphens)
- [ ] Content has proper heading hierarchy (H1 → H2 → H3)
- [ ] Internal links to related content
- [ ] External links open in new tab (optional)

### After Publishing
- [ ] Generate new sitemap: `npm run generate-sitemap`
- [ ] Test Open Graph: https://www.opengraph.xyz/
- [ ] Test Rich Results: https://search.google.com/test/rich-results
- [ ] Test PageSpeed: https://pagespeed.web.dev/
- [ ] Submit to Google Search Console (if not crawled yet)

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Generate sitemap
npm run generate-sitemap

# Deploy (includes sitemap generation)
npm run deploy

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🧪 Testing URLs

### Structured Data
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

### Open Graph
- OpenGraph.xyz: https://www.opengraph.xyz/
- Facebook Debugger: https://developers.facebook.com/tools/debug/

### Twitter Cards
- Twitter Card Validator: https://cards-dev.twitter.com/validator

### Performance
- Google PageSpeed Insights: https://pagespeed.web.dev/
- WebPageTest: https://www.webpagetest.org/
- GTmetrix: https://gtmetrix.com/

### Mobile Friendly
- Google Mobile-Friendly Test: https://search.google.com/test/mobile-friendly

---

## 📱 Social Media Image Sizes

| Platform | Optimal Size | Aspect Ratio |
|----------|--------------|--------------|
| Open Graph (Facebook) | 1200x630 | 1.91:1 |
| Twitter Large Card | 1200x628 | 1.91:1 |
| LinkedIn | 1200x627 | 1.91:1 |
| Twitter Summary | 300x157 | 1.91:1 |

**Recommendation**: Use 1200x630 for all platforms (works everywhere).

---

## 🎯 SEO Best Practices

### Title Tags
- Keep under 60 characters
- Include primary keyword
- Make it compelling/clickable
- Use brand name: "Page Title | Taia Tiniyara"

### Meta Descriptions
- Keep under 160 characters
- Include call-to-action
- Use active voice
- Include target keywords naturally

### Images
- Use descriptive file names (not IMG_1234.jpg)
- Always include alt text
- Optimize file size (< 200KB for web)
- Use modern formats (WebP, AVIF)
- Specify dimensions to prevent CLS

### URLs
- Use hyphens, not underscores
- Keep short and descriptive
- Use lowercase
- Include target keyword
- Avoid special characters

### Content
- Use H1 for main title (only one per page)
- Use H2-H6 for subsections
- Write for humans first, search engines second
- Include internal links
- Update old content regularly

---

## 📈 Key Metrics to Monitor

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### SEO Metrics
- Organic traffic
- Click-through rate (CTR)
- Average position in search
- Indexed pages
- Crawl errors

### Tools to Use
- Google Search Console
- Google Analytics
- Google PageSpeed Insights
- Lighthouse (Chrome DevTools)

---

## 🆘 Common Issues

### Sitemap Not Updating
```bash
# Delete old sitemap and regenerate
rm public/sitemap.xml
npm run generate-sitemap
```

### Structured Data Errors
- Test at: https://search.google.com/test/rich-results
- Ensure all required fields are present
- Check for typos in property names

### Images Not Showing in Social Previews
- Verify image URL is absolute (not relative)
- Image must be publicly accessible
- Use 1200x630 dimensions
- File size should be < 8MB

### Poor PageSpeed Score
- Check if sitemap is regenerated
- Optimize images (compress, use WebP)
- Remove unused dependencies
- Enable caching headers (already configured)

---

## 📞 Need Help?

Refer to:
- [SEO-OPTIMIZATIONS.md](SEO-OPTIMIZATIONS.md) - Full optimization guide
- [SEO-GUIDE.md](SEO-GUIDE.md) - Original SEO documentation
- Google Search Console Help: https://support.google.com/webmasters
- Web.dev: https://web.dev/

---

**Last Updated**: December 24, 2025
