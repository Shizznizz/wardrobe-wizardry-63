
import { useEffect } from 'react';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';

// List of critical assets to preload
const criticalAssets = [
  '/placeholder.svg',
  '/olivia-avatar.png',
  '/logo.png'
];

const CriticalAssetsPreloader = () => {
  useEffect(() => {
    // Manually preload images
    criticalAssets.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return null; // This component doesn't render anything
};

export default CriticalAssetsPreloader;
