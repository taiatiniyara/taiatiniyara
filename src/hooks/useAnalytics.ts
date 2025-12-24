import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Custom hook to track page views with Google Analytics
 * Automatically tracks route changes
 */
export function useAnalytics() {
  const router = useRouter();
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    // Only track if GA is loaded and measurement ID is configured
    if (!window.gtag || !measurementId) {
      return;
    }

    // Track initial page view
    const trackPageView = (pathname: string) => {
      window.gtag?.('event', 'page_view', {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    };

    // Track current page
    trackPageView(window.location.pathname);

    // Subscribe to route changes
    const unsubscribe = router.subscribe('onResolved', () => {
      trackPageView(window.location.pathname);
    });

    return () => {
      unsubscribe();
    };
  }, [router, measurementId]);
}

/**
 * Track custom events
 * @param eventName - The name of the event
 * @param eventParams - Additional parameters for the event
 */
export function trackEvent(eventName: string, eventParams?: Record<string, unknown>) {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}
