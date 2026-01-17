/**
 * Report Web Vitals to analytics or monitoring service
 * Tracks Core Web Vitals: LCP, FID, CLS, FCP, TTFB
 */

export interface WebVitalMetric {
  name: 'CLS' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

/**
 * Send metrics to your analytics endpoint
 * Replace this with your actual analytics implementation
 */
function sendToAnalytics(metric: WebVitalMetric) {
  if (import.meta.env.DEV) {
    console.log('[Web Vitals]', metric);
  }
  
  // Example: Send to Google Analytics
  // if (window.gtag) {
  //   window.gtag('event', metric.name, {
  //     value: Math.round(metric.value),
  //     metric_id: metric.id,
  //     metric_value: metric.value,
  //     metric_delta: metric.delta,
  //     metric_rating: metric.rating,
  //   });
  // }

  // Example: Send to custom endpoint
  // navigator.sendBeacon('/api/analytics', JSON.stringify(metric));
}

/**
 * Initialize Web Vitals reporting
 * Call this in your app's entry point
 */
export async function reportWebVitals() {
  if (typeof window === 'undefined') return;

  try {
    // Dynamically import web-vitals to avoid including it in the initial bundle
    const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');

    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  } catch (error) {
    console.error('Failed to load web-vitals:', error);
  }
}

/**
 * Get performance entries for navigation and resources
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  return {
    // Navigation timing
    dns: navigation?.domainLookupEnd - navigation?.domainLookupStart,
    tcp: navigation?.connectEnd - navigation?.connectStart,
    ttfb: navigation?.responseStart - navigation?.requestStart,
    download: navigation?.responseEnd - navigation?.responseStart,
    domInteractive: navigation?.domInteractive - navigation?.fetchStart,
    domComplete: navigation?.domComplete - navigation?.fetchStart,
    loadComplete: navigation?.loadEventEnd - navigation?.fetchStart,

    // Paint timing
    fcp: paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime,
    
    // Resource timing summary
    resources: performance.getEntriesByType('resource').length,
  };
}

/**
 * Monitor long tasks (tasks that block the main thread for > 50ms)
 */
export function observeLongTasks(callback: (tasks: PerformanceEntry[]) => void) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return () => {};
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      callback(entries);
      
      if (import.meta.env.DEV) {
        entries.forEach((entry) => {
          console.warn(`[Long Task] Duration: ${entry.duration.toFixed(2)}ms`, entry);
        });
      }
    });

    observer.observe({ entryTypes: ['longtask'] });

    return () => observer.disconnect();
  } catch (error) {
    console.error('Failed to observe long tasks:', error);
    return () => {};
  }
}

/**
 * Memory usage information (Chrome only)
 */
export function getMemoryInfo() {
  if (typeof window === 'undefined') return null;
  
  const memory = (performance as any).memory;
  
  if (!memory) return null;

  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    // Calculate percentage
    usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  };
}
