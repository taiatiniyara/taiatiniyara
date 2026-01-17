# Performance Optimization Guide

This document outlines the performance optimizations implemented in the project.

## 🚀 Build Optimizations

### Vite Configuration
- **CSS Code Splitting**: Enabled to improve caching and reduce initial bundle size
- **Terser Minification**: Aggressive minification with console.log removal in production
- **Smart Code Splitting**: Vendor chunks separated by library type:
  - `react-vendor`: React core libraries
  - `tanstack-vendor`: TanStack Router and Query
  - `tiptap-vendor`: Tiptap editor (lazy loaded)
  - `ui-vendor`: UI libraries (Lucide, Sonner, Radix)
  - `supabase-vendor`: Supabase client
  - `dnd-vendor`: DnD Kit libraries
- **Asset Organization**: Images, fonts, and JS files organized into separate directories with hashed names for optimal caching
- **Modern Target**: ES2020 target for smaller bundles (supports 95%+ of browsers)
- **Dependency Optimization**: Core dependencies pre-bundled, heavy dependencies excluded from optimization

### CSS Optimizations
- **Removed External Font Loading**: Eliminated Google Fonts HTTP requests
- **Local Fonts Only**: Using @fontsource-variable/outfit for better performance
- **Variable Fonts**: Using Outfit Variable for both sans and heading to reduce font files

## ⚡ Runtime Optimizations

### React Query Configuration
- **Reduced Refetching**: Disabled refetch on window focus
- **Smart Caching**: 5-minute garbage collection, 1-minute stale time
- **Exponential Backoff**: Retry failed requests with exponential delay
- **Reduced Retries**: Only retry once to prevent excessive network requests

### Component Loading
- **Lazy Devtools**: TanStack Router Devtools only loaded in development
- **Lazy Editor**: Tiptap editor lazy loaded with loading spinner
- **Auto Code Splitting**: TanStack Router automatically splits routes

## 📊 Performance Monitoring

### New Utilities

#### Web Vitals Tracking (`src/lib/web-vitals.ts`)
- Tracks Core Web Vitals: LCP, FID, CLS, FCP, TTFB, INP
- Long task monitoring (tasks > 50ms)
- Memory usage tracking (Chrome only)
- Performance metrics collection

#### Performance Hooks

**`usePerformanceMonitor`** (`src/hooks/usePerformanceMonitor.ts`)
- Monitor component render performance
- Log slow renders (default threshold: 16ms for 60fps)
- Track mount and render times
- Development-only warnings

**`useDebounce`** (`src/hooks/useDebounce.ts`)
- Debounce values and callbacks
- Throttle callbacks
- Track mounted state to prevent memory leaks

**`useIntersectionObserver`** (`src/hooks/useIntersectionObserver.ts`)
- Lazy load components when visible
- Trigger once option for performance
- Includes `LazyLoad` wrapper component

### Image Optimization

**`OptimizedImage`** (`src/components/ui/optimized-image.tsx`)
- Native lazy loading
- Placeholder support
- Async decoding
- Smooth fade-in transitions
- Error handling

**`useImagePreload`** hook
- Preload critical images
- Loading state tracking
- Error handling

### Lazy Loading Utilities

**`lazyWithPreload`** (`src/lib/lazy-utils.ts`)
- Enhanced lazy loading with preload capability
- Delay option for deprioritizing components
- Preload on hover/focus

**`lazyWithIntersection`**
- Load components only when visible
- Intersection Observer API integration

### Performance Utils (`src/lib/performance-utils.ts`)
- `debounce`: Debounce functions
- `throttle`: Throttle functions
- `requestIdleCallback`: Polyfill for browsers without support
- `withMemo`: HOC for memoization
- `shallowEqual`: Shallow comparison for memo

## 📈 Usage Examples

### Monitor Component Performance
```tsx
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

function MyComponent() {
  usePerformanceMonitor('MyComponent', 16); // Warn if render > 16ms
  // ... component code
}
```

### Lazy Load Images
```tsx
import { OptimizedImage } from '@/components/ui/optimized-image';

<OptimizedImage
  src="/large-image.jpg"
  alt="Description"
  placeholder="/small-placeholder.jpg"
  loading="lazy"
/>
```

### Debounce Search Input
```tsx
import { useDebouncedCallback } from '@/hooks/useDebounce';

const handleSearch = useDebouncedCallback((value: string) => {
  // Search logic
}, 300);
```

### Lazy Load Component When Visible
```tsx
import { LazyLoad } from '@/hooks/useIntersectionObserver';

<LazyLoad placeholder={<Skeleton />}>
  <ExpensiveComponent />
</LazyLoad>
```

### Preload Component on Hover
```tsx
import { lazyWithPreload, preloadComponent } from '@/lib/lazy-utils';

const HeavyComponent = lazyWithPreload(() => import('./HeavyComponent'));

<button 
  onMouseEnter={() => preloadComponent(HeavyComponent)}
  onClick={() => navigate('/heavy')}
>
  Go to Page
</button>
```

### Track Web Vitals
```tsx
// In main.tsx
import { reportWebVitals } from '@/lib/web-vitals';

reportWebVitals(); // Start tracking
```

## 🎯 Performance Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8s
- **TTFB (Time to First Byte)**: < 600ms
- **Bundle Size**: < 500KB initial (gzipped)
- **Route Chunks**: < 200KB per route (gzipped)

## 📝 Best Practices

1. **Use OptimizedImage** instead of regular `<img>` tags
2. **Lazy load** heavy components (editors, charts, etc.)
3. **Debounce** search inputs and frequent events
4. **Throttle** scroll and resize handlers
5. **Monitor** component performance in development
6. **Preload** critical resources and next-page components
7. **Use memo** for expensive components that re-render often
8. **Track Web Vitals** in production

## 🔧 Further Optimizations

Consider implementing:
- Service Worker for offline support and caching
- HTTP/2 Server Push for critical resources
- Image CDN with automatic format conversion (WebP, AVIF)
- Route-based code splitting with prefetching
- Bundle analyzer to identify large dependencies
- Compression (Brotli) on server
- Edge caching with CDN

## 📊 Monitoring

To monitor performance in production:
1. Enable Web Vitals tracking in `main.tsx`
2. Configure analytics endpoint in `src/lib/web-vitals.ts`
3. Use Chrome DevTools Performance panel for profiling
4. Check Lighthouse scores regularly
5. Monitor bundle sizes with `vite-bundle-visualizer`

## 🛠️ Development Tools

```bash
# Analyze bundle size
npm install -D vite-bundle-visualizer
# Add to vite.config.ts: import { visualizer } from 'vite-bundle-visualizer';
# Then add to plugins: visualizer({ open: true })

# Preview production build
npm run build
npm run preview
```
