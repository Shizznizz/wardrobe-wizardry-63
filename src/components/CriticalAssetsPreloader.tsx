import { useEffect } from 'react';
import { preloadImages } from '@/hooks/useOptimizedImage';

/**
 * Component that preloads critical assets (images, fonts, etc.)
 * This component doesn't render anything visible, just handles preloading
 */
const CriticalAssetsPreloader = () => {
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      // Hero section image (Olivia avatar)
      '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png',
      // Other critical images can be added here
    ];

    // Use the existing preloadImages utility
    preloadImages(criticalImages);

    // Preload critical fonts if needed
    const preloadFont = (fontUrl: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = fontUrl;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preload critical CSS if needed
    const preloadCSS = (cssUrl: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = cssUrl;
      document.head.appendChild(link);
    };

    // Set up client-side caching headers via service worker
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
          console.error('Service worker registration failed:', error);
        });
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default CriticalAssetsPreloader;
