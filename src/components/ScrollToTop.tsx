
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component that scrolls to the top of the page when the route path changes
 * This ensures users always start at the top when navigating to a new page
 */
export default function ScrollToTop() {
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    // Scroll to top whenever the pathname changes
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Use smooth scrolling for better UX
    });
  }, [pathname]); // Only trigger on pathname changes

  return null;
}
