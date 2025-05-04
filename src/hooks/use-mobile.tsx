
import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    // Initial check on client-side
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false; // Server-side rendering default
  });

  useEffect(() => {
    // Skip in SSR environments
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Check once on mount
    checkMobile();
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
}
