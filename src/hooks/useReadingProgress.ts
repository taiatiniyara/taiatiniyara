import { useState, useEffect } from "react";

/**
 * Hook to track reading progress of an article
 * Calculates scroll progress based on article element position
 * @param elementId - ID of the article element to track
 * @param enabled - Whether tracking is enabled (default: true)
 * @returns Current reading progress as percentage (0-100)
 */
export function useReadingProgress(elementId: string, enabled = true): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const article = document.getElementById(elementId);
      if (!article) return;

      const windowHeight = window.innerHeight;
      const documentHeight = article.offsetHeight;
      const scrollTop = window.scrollY;
      const articleTop = article.offsetTop;
      
      const scrollDistance = scrollTop - articleTop + windowHeight;
      const calculatedProgress = Math.min(100, Math.max(0, (scrollDistance / documentHeight) * 100));
      
      setProgress(calculatedProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementId, enabled]);

  return progress;
}
