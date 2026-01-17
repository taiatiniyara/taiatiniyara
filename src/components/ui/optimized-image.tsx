import { useEffect, useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized Image component with lazy loading and placeholder support
 */
export function OptimizedImage({
  src,
  alt,
  placeholder,
  className,
  loading = 'lazy',
  onLoad,
  onError,
  ...props
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div className={`relative ${className || ''}`}>
      {!isLoaded && placeholder && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className || ''} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
}

/**
 * Hook for image preloading
 */
export function useImagePreload(src: string | string[]) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const sources = Array.isArray(src) ? src : [src];
    let cancelled = false;

    const loadImages = async () => {
      try {
        await Promise.all(
          sources.map(
            (source) =>
              new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => reject(new Error(`Failed to load ${source}`));
                img.src = source;
              })
          )
        );
        
        if (!cancelled) {
          setIsLoaded(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      }
    };

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [src]);

  return { isLoaded, error };
}
