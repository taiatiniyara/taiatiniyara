import { useEffect } from 'react';

/**
 * Preload images to improve perceived performance
 * @param imageUrls Array of image URLs to preload
 */
export function usePreloadImages(imageUrls: string[]) {
  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) return;

    const images: HTMLImageElement[] = [];

    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      images.push(img);
    });

    return () => {
      // Cleanup references
      images.forEach((img) => {
        img.src = '';
      });
    };
  }, [imageUrls]);
}
