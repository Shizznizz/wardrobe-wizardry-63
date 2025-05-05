
import { useState, useEffect } from 'react';

interface UseOptimizedImageOptions {
  lazyLoad?: boolean;
  placeholderColor?: string;
  quality?: 'low' | 'medium' | 'high';
  priority?: boolean;
}

export const useOptimizedImage = (
  src: string | undefined,
  options: UseOptimizedImageOptions = {}
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState<string | undefined>(src);
  
  useEffect(() => {
    // Reset loaded state when src changes
    setIsLoaded(false);
    setOptimizedSrc(src);
  }, [src]);
  
  // If we have URL parameters, let's remove them for the check
  const effectiveSrc = src?.split('?')[0];
  const isSupabaseUrl = effectiveSrc?.includes('supabase.co');
  
  // Pre-load the image
  useEffect(() => {
    if (!src) return;
    
    // For Supabase URLs, make sure we use the original URL
    if (isSupabaseUrl) {
      setOptimizedSrc(src);
    }
    
    // If priority is set, preload the image
    if (options.priority && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
    }
  }, [src, options.priority, isSupabaseUrl]);
  
  const imgProps = {
    onLoad: () => setIsLoaded(true),
    onError: () => console.error('Image failed to load:', src)
  };
  
  return {
    src: optimizedSrc,
    isLoaded,
    imgProps
  };
};
