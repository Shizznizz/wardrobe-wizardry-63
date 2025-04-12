
import { useState, useEffect } from 'react';

interface UseOptimizedImageOptions {
  lazyLoad?: boolean;
  placeholderColor?: string;
  quality?: 'low' | 'medium' | 'high';
  priority?: boolean;
}

interface OptimizedImageProps {
  src: string | null;
  loading?: 'lazy' | 'eager' | undefined;
  style?: React.CSSProperties;
  onLoad: () => void;
  onError: () => void;
}

/**
 * Hook for optimized image loading with lazy loading support
 */
export const useOptimizedImage = (
  src: string | null,
  options: UseOptimizedImageOptions = {}
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizedSrc, setOptimizedSrc] = useState<string | null>(null);
  
  const {
    lazyLoad = true,
    placeholderColor = '#1e293b',
    quality = 'medium',
    priority = false
  } = options;

  useEffect(() => {
    if (!src) {
      setOptimizedSrc(null);
      setIsLoaded(false);
      setError(null);
      return;
    }

    // Reset states when src changes
    setIsLoaded(false);
    setError(null);

    // For now, we're just passing through the src
    // In a real implementation, you might transform the URL to WebP
    // or call an image optimization service
    setOptimizedSrc(src);

    // Preload image if priority is true
    if (priority) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setError('Failed to load image');
    }
  }, [src, priority]);

  return {
    src: optimizedSrc,
    isLoaded,
    error,
    // Attributes to spread onto the img element
    imgProps: {
      src: optimizedSrc,
      loading: lazyLoad && !priority ? 'lazy' : undefined,
      style: !isLoaded ? { backgroundColor: placeholderColor } : undefined,
      onLoad: () => setIsLoaded(true),
      onError: () => setError('Failed to load image')
    } as OptimizedImageProps
  };
};
