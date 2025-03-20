
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <AuroraBackground>
      <div className="min-h-screen flex items-center justify-center z-10">
        <div className="text-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-8 rounded-lg border shadow-md">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">Oops! Page not found</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </a>
        </div>
      </div>
    </AuroraBackground>
  );
};

export default NotFound;
