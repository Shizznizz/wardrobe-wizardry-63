
import React from 'react';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  quality?: 'low' | 'medium' | 'high';
  lazyLoad?: boolean;
  style?: React.CSSProperties;
  placeholderColor?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  quality = 'medium',
  lazyLoad = true,
  style,
  placeholderColor = '#1e293b',
  onLoad,
  onError,
}) => {
  const { 
    src: optimizedSrc, 
    isLoaded, 
    imgProps 
  } = useOptimizedImage(src, {
    lazyLoad,
    placeholderColor,
    quality,
    priority
  });

  return (
    <img
      src={optimizedSrc || ''}
      alt={alt}
      className={`${className} ${!isLoaded ? 'animate-pulse bg-opacity-50' : ''}`}
      loading={lazyLoad && !priority ? 'lazy' : 'eager'}
      style={{
        ...style,
        backgroundColor: !isLoaded ? placeholderColor : undefined,
      }}
      onLoad={() => {
        imgProps.onLoad();
        if (onLoad) onLoad();
      }}
      onError={() => {
        if (imgProps.onError) imgProps.onError();
        if (onError) onError();
      }}
    />
  );
};

export default OptimizedImage;
