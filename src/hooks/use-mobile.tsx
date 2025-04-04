
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialize with the current window width if available
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    return false
  })

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add event listener with better debounce for performance
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    // Add listeners for both resize and orientation change for mobile devices
    window.addEventListener('resize', debouncedHandleResize)
    window.addEventListener('orientationchange', handleResize)
    
    // Set initial value
    handleResize()
    
    // Clean up
    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
      window.removeEventListener('orientationchange', handleResize)
      clearTimeout(timeoutId);
    }
  }, [])

  return isMobile
}
