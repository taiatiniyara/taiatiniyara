import { useState, useEffect, useRef, useCallback } from 'react';
import type React from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /**
   * Only trigger once when element becomes visible
   */
  triggerOnce?: boolean;
  
  /**
   * Enable the observer (useful for conditional observation)
   */
  enabled?: boolean;
}

/**
 * Hook to observe element visibility using Intersection Observer API
 * Useful for lazy loading images, infinite scroll, animations, etc.
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    triggerOnce = false,
    enabled = true,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    targetRef.current = node;
  }, []);

  useEffect(() => {
    const target = targetRef.current;
    
    if (!enabled || !target) return;
    
    if (triggerOnce && hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;
        
        setIsIntersecting(isCurrentlyIntersecting);
        
        if (isCurrentlyIntersecting) {
          setHasIntersected(true);
          
          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [enabled, threshold, root, rootMargin, triggerOnce, hasIntersected]);

  return { ref: setRef, isIntersecting, hasIntersected };
}

/**
 * Component wrapper for lazy loading content when visible
 */
interface LazyLoadProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  rootMargin?: string;
  className?: string;
}

export function LazyLoad({
  children,
  placeholder = null,
  rootMargin = '100px',
  className,
}: LazyLoadProps) {
  const { ref, hasIntersected } = useIntersectionObserver({
    triggerOnce: true,
    rootMargin,
  });

  return (
    <div ref={ref} className={className}>
      {hasIntersected ? children : placeholder}
    </div>
  );
}
