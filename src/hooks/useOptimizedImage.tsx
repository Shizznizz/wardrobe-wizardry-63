
import { useState, useEffect, useRef } from 'react';

interface UseOptimizedImageOptions {
  lazyLoad?: boolean;
  placeholderColor?: string;
  quality?: 'low' | 'medium' | 'high';
  priority?: boolean;
  cacheImages?: boolean;
}

interface OptimizedImageProps {
  src: string | null;
  loading?: 'lazy' | 'eager' | undefined;
  style?: React.CSSProperties;
  onLoad: () => void;
  onError: () => void;
}

// Cache for storing preloaded images
const imageCache = new Map<string, boolean>();

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
  const isMounted = useRef(true);
  
  const {
    lazyLoad = true,
    placeholderColor = '#1e293b',
    quality = 'medium',
    priority = false,
    cacheImages = true
  } = options;

  useEffect(() => {
    // Set the ref to true on mount and false on unmount
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

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

    // Check if the image is already in cache
    if (cacheImages && imageCache.has(src)) {
      setOptimizedSrc(src);
      setIsLoaded(true);
      return;
    }

    // Determine if we should use a compressed or original version based on quality
    let targetSrc = src;
    
    // For now, we're just passing through the src
    // In a real implementation, you might transform the URL to WebP
    // or call an image optimization service
    setOptimizedSrc(targetSrc);

    // Preload image if priority is true
    if (priority || !lazyLoad) {
      const img = new Image();
      img.src = targetSrc;
      
      img.onload = () => {
        if (isMounted.current) {
          setIsLoaded(true);
          if (cacheImages) {
            imageCache.set(src, true);
          }
        }
      };
      
      img.onerror = () => {
        if (isMounted.current) {
          setError('Failed to load image');
        }
      };
    }
  }, [src, priority, quality, lazyLoad, cacheImages]);

  // Function to preload multiple images
  const preloadImages = (urls: string[]) => {
    urls.forEach(url => {
      if (!imageCache.has(url)) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          imageCache.set(url, true);
        };
      }
    });
  };

  return {
    src: optimizedSrc,
    isLoaded,
    error,
    preloadImages,
    // Attributes to spread onto the img element
    imgProps: {
      src: optimizedSrc,
      loading: lazyLoad && !priority ? 'lazy' : 'eager',
      style: !isLoaded ? { backgroundColor: placeholderColor } : undefined,
      onLoad: () => {
        setIsLoaded(true);
        if (cacheImages && src) {
          imageCache.set(src, true);
        }
      },
      onError: () => setError('Failed to load image')
    } as OptimizedImageProps
  };
};

// Utility to batch preload images (useful for prefetching next page content)
export const preloadImages = (urls: string[]) => {
  urls.forEach(url => {
    if (!imageCache.has(url)) {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        imageCache.set(url, true);
      };
    }
  });
};

// Utility to clear image cache
export const clearImageCache = () => {
  imageCache.clear();
};
