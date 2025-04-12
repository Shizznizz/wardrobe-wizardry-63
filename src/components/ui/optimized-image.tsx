
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
  ...props
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const { isLoaded, error, imgProps } = useOptimizedImage(imgSrc, {
    lazyLoad: !priority,
    priority
  });

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  // Extract loading from imgProps to fix TypeScript error
  const { loading, ...safeImgProps } = imgProps;

  return (
    <div className={cn("relative overflow-hidden", aspectRatio, containerClassName)}>
      {(!isLoaded && showSkeleton) && (
        <Skeleton 
          className={cn("absolute inset-0 z-10", skeletonClassName)} 
        />
      )}
      
      <img
        {...safeImgProps}
        {...props}
        alt={alt}
        loading={loading as "lazy" | "eager" | undefined}
        className={cn(
          "object-cover w-full h-full transition-opacity duration-300",
          !isLoaded && "opacity-0",
          isLoaded && "opacity-100",
          className
        )}
        onError={handleError}
      />
    </div>
  );
};

export default memo(OptimizedImage);
