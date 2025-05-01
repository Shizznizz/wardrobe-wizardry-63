
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component that scrolls to the top of the page ONLY when the route path changes
 * This prevents unnecessary scrolling during internal navigation
 */
export default function ScrollToTop() {
  const location = useLocation();
  const { pathname, state } = location;

  useEffect(() => {
    // Only scroll to top when the path changes and there's no state parameter
    // This prevents scrolling when navigating with outfit selection
    if (!state || !state.selectedOutfit) {
      window.scrollTo({
        top: 0,
        behavior: "smooth" // Use smooth scrolling for better UX
      });
    }
  }, [pathname, state]); // Trigger on pathname and state changes

  return null;
}
