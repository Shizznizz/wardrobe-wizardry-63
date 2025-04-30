
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component that scrolls to the top of the page ONLY when the route path changes
 * This prevents unnecessary scrolling during internal navigation
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top when the path changes, not on all navigation events
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Use smooth scrolling for better UX
    });
  }, [pathname]); // Only trigger on pathname changes

  return null;
}
