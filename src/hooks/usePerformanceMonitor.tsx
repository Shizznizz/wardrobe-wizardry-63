
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  FCP: number | null; // First Contentful Paint
  LCP: number | null; // Largest Contentful Paint
  FID: number | null; // First Input Delay
  CLS: number | null; // Cumulative Layout Shift
  TTI: number | null; // Time to Interactive
  pageLoadTime: number | null; // Total page load time
}

// Define types for web performance observer entries
interface PerformanceEntryWithProcessingStart extends PerformanceEntry {
  processingStart?: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput?: boolean;
  value?: number;
}

/**
 * Hook to monitor and report web performance metrics
 */
export const usePerformanceMonitor = (pageName: string) => {
  const metrics = useRef<PerformanceMetrics>({
    FCP: null,
    LCP: null,
    FID: null,
    CLS: null,
    TTI: null,
    pageLoadTime: null
  });
  
  useEffect(() => {
    if (!window.performance || !window.performance.timing) {
      console.warn('Performance API not supported in this browser');
      return;
    }
    
    // Record page load time
    const recordPageLoadTime = () => {
      const pageLoadTime = 
        window.performance.timing.loadEventEnd - 
        window.performance.timing.navigationStart;
      
      metrics.current.pageLoadTime = pageLoadTime;
      console.info(`[Performance] ${pageName} - Page Load Time: ${pageLoadTime}ms`);
    };
    
    // First Contentful Paint
    const recordFCP = () => {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        metrics.current.FCP = fcpEntry.startTime;
        console.info(`[Performance] ${pageName} - FCP: ${fcpEntry.startTime}ms`);
      }
    };
    
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        metrics.current.LCP = lastEntry.startTime;
        console.info(`[Performance] ${pageName} - LCP: ${lastEntry.startTime}ms`);
      }
    });
    
    // First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const firstEntry = entryList.getEntries()[0] as PerformanceEntryWithProcessingStart;
      
      if (firstEntry && firstEntry.processingStart !== undefined) {
        metrics.current.FID = firstEntry.processingStart - firstEntry.startTime;
        console.info(`[Performance] ${pageName} - FID: ${metrics.current.FID}ms`);
      }
    });
    
    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      
      for (const entry of entryList.getEntries() as LayoutShiftEntry[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value || 0;
        }
      }
      
      metrics.current.CLS = clsValue;
      console.info(`[Performance] ${pageName} - CLS: ${clsValue}`);
    });
    
    try {
      // Register observers
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      fidObserver.observe({ type: 'first-input', buffered: true });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      
      // Wait for page to fully load
      window.addEventListener('load', () => {
        // Give a small delay to ensure metrics are collected
        setTimeout(() => {
          recordPageLoadTime();
          recordFCP();
          
          // Optional: Send metrics to analytics
          // sendMetricsToAnalytics(metrics.current);
        }, 1000);
      });
    } catch (error) {
      console.error('[Performance] Error setting up metrics:', error);
    }
    
    return () => {
      // Disconnect observers on cleanup
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, [pageName]);
  
  return metrics.current;
};
