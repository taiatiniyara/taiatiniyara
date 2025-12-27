# SEO Quick Reference

Quick commands and reminders for SEO maintenance.

## Generate Sitemap
```bash
npm run generate-sitemap
```
Run this after publishing new content (blog posts, projects, courses).

## Check SEO Implementation

### Verify Meta Tags
Open any page and check in DevTools:
- Title is unique
- Description exists (150-160 chars)
- OG tags present
- Canonical URL correct

### Test Structured Data
1. Visit: https://search.google.com/test/rich-results
2. Test blog post: `https://taiatiniyara.com/blog/[slug]`
3. Test project: `https://taiatiniyara.com/projects/[slug]`

### Test Mobile
1. Visit: https://search.google.com/test/mobile-friendly
2. Test all major pages

## Files Modified

### New Files
- ✅ `public/robots.txt` - Controls crawler access
- ✅ `src/lib/sitemap-generator.ts` - Generates sitemap
- ✅ `src/hooks/useSEO.ts` - Dynamic meta tags hook
- ✅ `docs/SEO_GUIDE.md` - Complete SEO documentation

### Updated Files
- ✅ `index.html` - Added resource hints
- ✅ `package.json` - Added sitemap script
- ✅ `src/routes/index.tsx` - Added SEO hook
- ✅ `src/routes/about.tsx` - Added SEO hook
- ✅ `src/routes/blog/index.tsx` - Added SEO hook
- ✅ `src/routes/blog/$slug.tsx` - Added SEO + structured data
- ✅ `src/routes/projects/index.tsx` - Added SEO hook
- ✅ `src/routes/projects/$slug.tsx` - Added SEO + structured data

## Key Features Implemented

### ✅ Technical SEO
- Robots.txt with proper directives
- Dynamic sitemap generation
- Canonical URLs on all pages
- Resource hints (dns-prefetch, preconnect)
- Mobile-responsive (already was)

### ✅ On-Page SEO
- Dynamic page titles
- Unique meta descriptions
- Keyword optimization
- Open Graph tags
- Twitter Cards
- Article meta tags

### ✅ Structured Data (JSON-LD)
- Organization schema (homepage)
- BlogPosting schema (blog posts)
- CreativeWork schema (projects)
- Person schema (author info)

### ✅ Image SEO
- All images have proper alt text
- Images use descriptive filenames

## Monitoring Checklist

### After Publishing Content
- [ ] Run `npm run generate-sitemap`
- [ ] Commit and push sitemap.xml
- [ ] Check page in incognito mode
- [ ] Verify meta tags in view source
- [ ] Test structured data

### Weekly
- [ ] Check Google Search Console
- [ ] Monitor PageSpeed Insights
- [ ] Review search rankings

### Monthly
- [ ] Update content for freshness
- [ ] Check for broken links
- [ ] Review keyword performance
- [ ] Analyze competitor SEO

## Target Keywords Priority

**Primary (Highest)**
1. software engineer Fiji
2. programmer Fiji
3. software developer Fiji

**Secondary**
4. web development Fiji
5. coding courses Fiji
6. developer training Pacific

**Long-tail**
7. software engineering courses Fiji
8. React developer Fiji
9. full stack developer Pacific Islands

## Quick Wins Done ✅

1. ✅ Added robots.txt
2. ✅ Created sitemap generator
3. ✅ Implemented dynamic meta tags
4. ✅ Added structured data
5. ✅ Optimized all route pages
6. ✅ Added resource hints
7. ✅ All images have alt text

## Next Steps (Optional)

1. **Submit to Search Engines**
   - Google Search Console
   - Bing Webmaster Tools

2. **Create Google Business Profile**
   - For local SEO in Fiji

3. **Build Backlinks**
   - Guest posting
   - Directory submissions
   - Social media profiles

4. **Monitor & Iterate**
   - Track rankings
   - Analyze traffic
   - Optimize based on data

---

For complete documentation, see: [SEO_GUIDE.md](./SEO_GUIDE.md)
