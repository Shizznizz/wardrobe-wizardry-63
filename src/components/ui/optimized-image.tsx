
import React, { useState, useEffect, memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  aspectRatio?: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  showSkeleton?: boolean;
  skeletonClassName?: string;
  threshold?: number;
  debounceLoad?: number;
}

const OptimizedImage = ({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  aspectRatio = 'aspect-square',
  className,
  containerClassName,
  priority = false,
  showSkeleton = true,
  skeletonClassName,
  threshold = 0.1,
  debounceLoad = 100,
  width, // Explicitly destructure width
  ...props
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isInView, setIsInView] = useState(priority);
  
  // Convert width to a number if it's a string, or use 300 as default
  const normalizedWidth = typeof width === 'string' ? parseInt(width, 10) : width || 300;
  
  const { isLoaded, error, imgProps } = useOptimizedImage(isInView ? imgSrc : null, {
    lazyLoad: !priority,
    priority,
    quality: normalizedWidth < 300 ? 'low' : 'medium'
  });

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  useEffect(() => {
    if (priority) return; // Skip intersection observer for priority images
    
    // Create and configure IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          const timer = setTimeout(() => {
            setIsInView(true);
          }, debounceLoad);
          
          return () => clearTimeout(timer);
        }
      },
      { threshold }
    );
    
    // Get current element reference
    const element = document.getElementById(`img-${alt.replace(/\s+/g, '-').toLowerCase()}`);
    if (element) observer.observe(element);
    
    // Cleanup
    return () => {
      if (element) observer.unobserve(element);
      observer.disconnect();
    };
  }, [alt, debounceLoad, priority, threshold]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  // Convert loading to the correct type
  const { loading, ...safeImgProps } = imgProps;
  
  return (
    <div 
      id={`img-${alt.replace(/\s+/g, '-').toLowerCase()}`}
      className={cn("relative overflow-hidden", aspectRatio, containerClassName)}
    >
      {(!isLoaded && showSkeleton) && (
        <Skeleton 
          className={cn("absolute inset-0 z-10", skeletonClassName)} 
        />
      )}
      
      {isInView && (
        <img
          {...safeImgProps}
          {...props}
          alt={alt}
          src={imgProps.src || fallbackSrc}
          loading={loading as "lazy" | "eager" | undefined}
          className={cn(
            "object-cover w-full h-full transition-opacity duration-300",
            !isLoaded && "opacity-0",
            isLoaded && "opacity-100",
            className
          )}
          onError={handleError}
          data-testid="optimized-image"
        />
      )}
      
      {!isInView && (
        <div className={cn(
          "w-full h-full bg-slate-800/60",
          className
        )} />
      )}
    </div>
  );
};

// Using memo to prevent unnecessary re-renders
export default memo(OptimizedImage);
