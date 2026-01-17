import { useEffect, useRef } from 'react';

/**
 * Monitor component performance and log slow renders
 * @param componentName Name of the component being monitored
 * @param threshold Time threshold in ms to log warnings (default: 16ms for 60fps)
 */
export function usePerformanceMonitor(
  componentName: string,
  threshold: number = 16
) {
  const renderStartTime = useRef<number>(0);
  const mountTime = useRef<number | null>(null);

  // Track render start
  renderStartTime.current = performance.now();

  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;

    // Track mount time on first render
    if (mountTime.current === null) {
      mountTime.current = renderTime;
      
      if (renderTime > threshold && import.meta.env.DEV) {
        console.warn(
          `[Performance] ${componentName} mount took ${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`
        );
      }
    } else {
      // Track subsequent renders
      if (renderTime > threshold && import.meta.env.DEV) {
        console.warn(
          `[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`
        );
      }
    }
  });

  return {
    logMetric: (metricName: string, value: number) => {
      if (import.meta.env.DEV) {
        console.log(`[Performance] ${componentName} - ${metricName}: ${value.toFixed(2)}ms`);
      }
    },
  };
}

/**
 * Measure and log async operations performance
 */
export async function measureAsync<T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${operationName} completed in ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (import.meta.env.DEV) {
      console.error(`[Performance] ${operationName} failed after ${duration.toFixed(2)}ms`, error);
    }
    
    throw error;
  }
}
