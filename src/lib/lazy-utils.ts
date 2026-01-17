import { lazy, type ComponentType } from 'react';

interface LazyLoadOptions {
  /**
   * Delay before loading the component (in ms)
   * Useful for deprioritizing non-critical components
   */
  delay?: number;
  
  /**
   * Preload the component on hover/focus
   */
  preload?: boolean;
}

/**
 * Enhanced lazy loading with preloading support
 * @param importFn Dynamic import function
 * @param options LazyLoad options
 */
export function lazyWithPreload<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) {
  const { delay = 0, preload = true } = options;

  let componentPromise: Promise<{ default: T }> | null = null;

  const load = () => {
    if (!componentPromise) {
      if (delay > 0) {
        componentPromise = new Promise((resolve) => {
          setTimeout(() => {
            importFn().then(resolve);
          }, delay);
        });
      } else {
        componentPromise = importFn();
      }
    }
    return componentPromise;
  };

  const LazyComponent = lazy(load);

  // Add preload capability
  (LazyComponent as any).preload = preload ? load : undefined;

  return LazyComponent;
}

/**
 * Preload a lazy component
 * @param Component Lazy component with preload method
 */
export function preloadComponent<T extends ComponentType<any>>(
  Component: T & { preload?: () => void }
) {
  if (Component.preload) {
    Component.preload();
  }
}

/**
 * Create a lazy component that loads only when visible (using Intersection Observer)
 */
export function lazyWithIntersection<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: IntersectionObserverInit = {}
) {
  return lazy(() => {
    return new Promise<{ default: T }>((resolve) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              importFn().then(resolve);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '50px', ...options }
      );

      // Observe a temporary element
      const tempDiv = document.createElement('div');
      document.body.appendChild(tempDiv);
      observer.observe(tempDiv);

      // Cleanup after 10 seconds if not intersected
      setTimeout(() => {
        observer.disconnect();
        document.body.removeChild(tempDiv);
        importFn().then(resolve);
      }, 10000);
    });
  });
}
