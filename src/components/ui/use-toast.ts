
import { toast } from "sonner";

// Re-export for consistent usage throughout the app
export { toast };

// You can also export a custom hook if needed
export const useToast = () => {
  // Custom toast configuration for better mobile experience
  const showToast = (message: string, options?: any) => {
    const isMobile = window.innerWidth < 768;
    
    return toast(message, {
      position: isMobile ? "top-center" : "bottom-right",
      duration: isMobile ? 3000 : 4000,
      className: isMobile ? "mobile-toast" : "",
      ...options,
    });
  };
  
  return {
    toast: showToast,
    defaultToast: toast
  };
};
