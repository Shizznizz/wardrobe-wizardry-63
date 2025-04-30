import { useEffect } from 'react';
import { preloadImages } from '@/hooks/useOptimizedImage';

/**
 * Component that preloads critical assets (images, fonts, etc.)
 * This component doesn't render anything visible, just handles preloading
 */
const CriticalAssetsPreloader = () => {
  useEffect(() => {
    // Preload critical images with high priority
    const criticalImages = [
      // Hero section - Olivia avatar (highest priority)
      '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png',
      
      // Other homepage critical images
      '/lovable-uploads/c26c0c8c-7ff3-432a-b79b-1d22494daba6.png',
      '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png',
      '/lovable-uploads/4e16d86c-652b-4717-958f-b48ce5663c9b.png',
      
      // Community looks section images
      '/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png',
      '/lovable-uploads/e4bf2134-0936-46f8-8d70-adcc220e50be.png',
      '/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png',
      
      // Any new images that were uploaded
      '/lovable-uploads/0d7fa3b7-6021-40f8-8d5f-5888742474a7.png',
      '/lovable-uploads/fc3adcfb-8651-4f05-b4ea-ae17d34c7699.png'
    ];

    // Preload images immediately on component mount with high priority
    preloadImages(criticalImages);

    // Preload critical fonts
    const preloadFont = (fontUrl: string, fontFormat = 'woff2') => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = fontUrl;
      link.type = `font/${fontFormat}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preload the main fonts used in the app
    preloadFont('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    // Preload critical CSS if needed
    const preloadCSS = (cssUrl: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = cssUrl;
      document.head.appendChild(link);
    };

    // Inject a hint to browser to establish early connections
    const preconnect = (url: string) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preconnect to origins we'll need resources from
    preconnect('https://fonts.googleapis.com');
    preconnect('https://fonts.gstatic.com');

    // Set up client-side caching headers via service worker
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(error => {
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
