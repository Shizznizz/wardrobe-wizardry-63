
import { toast } from "sonner";

// Re-export for consistent usage throughout the app
export { toast };

// You can also export a custom hook if needed
export const useToast = () => {
  return {
    toast
  };
};
