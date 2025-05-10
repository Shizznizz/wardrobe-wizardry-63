
import React, { useState } from 'react';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';

export interface OptimizedImageProps {
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
  // Adding props that were causing TypeScript errors
  showSkeleton?: boolean;
  aspectRatio?: string;
  fallbackSrc?: string;
  containerClassName?: string;
  width?: number;
  height?: number;
  // New glow effect props
  withGlow?: boolean;
  glowColor?: string;
  hoverGlowColor?: string;
  glowIntensity?: 'light' | 'medium' | 'strong';
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
  showSkeleton,
  aspectRatio,
  fallbackSrc = '/placeholder.svg',
  containerClassName,
  width,
  height,
  // Glow effect props
  withGlow = false,
  glowColor = 'rgba(236, 72, 153, 0.4)', // Default pink glow
  hoverGlowColor = 'rgba(236, 72, 153, 0.7)', // Default pink glow on hover
  glowIntensity = 'medium',
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
  
  const [imgError, setImgError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Use fallback source if provided and original source had an error
  const finalSrc = imgError ? fallbackSrc : (optimizedSrc || src);

  // Handle aspect ratio styling
  const aspectRatioStyle = aspectRatio ? {
    aspectRatio,
    objectFit: 'cover' as const,
    ...style
  } : style;

  // Calculate glow box-shadow based on intensity
  const getGlowShadow = () => {
    if (!withGlow) return undefined;
    
    const intensity = {
      light: '0 0 20px',
      medium: '0 0 30px',
      strong: '0 0 40px'
    }[glowIntensity];
    
    return isHovering 
      ? `${intensity.replace('30', '60')} ${hoverGlowColor}` 
      : `${intensity} ${glowColor}`;
  };

  // Element to render
  const imgElement = (
    <img
      src={finalSrc}
      alt={alt}
      className={`${className} ${!isLoaded && showSkeleton ? 'animate-pulse bg-opacity-50' : ''} ${withGlow ? 'transition-shadow duration-300 ease-in-out' : ''}`}
      loading={lazyLoad && !priority ? 'lazy' : 'eager'}
      style={{
        ...aspectRatioStyle,
        backgroundColor: !isLoaded && showSkeleton ? placeholderColor : undefined,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        boxShadow: getGlowShadow(),
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onLoad={() => {
        if (imgProps.onLoad) imgProps.onLoad();
        if (onLoad) onLoad();
      }}
      onError={() => {
        setImgError(true);
        if (imgProps.onError) imgProps.onError();
        if (onError) onError();
      }}
    />
  );

  // If containerClassName is provided, wrap the image in a div
  if (containerClassName) {
    return (
      <div className={containerClassName}>
        {imgElement}
      </div>
    );
  }

  return imgElement;
};

export default OptimizedImage;
