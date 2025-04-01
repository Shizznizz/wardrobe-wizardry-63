
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PredictionPollerProps {
  predictionId: string | null;
  onPredictionComplete: (imageUrl: string) => void;
  onPredictionError?: (error: string) => void;
}

const PredictionPoller = ({ 
  predictionId, 
  onPredictionComplete,
  onPredictionError
}: PredictionPollerProps) => {
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 40; // About 2 minutes with 3-second intervals
  
  useEffect(() => {
    if (!predictionId) return;
    
    console.log("Starting polling for prediction ID:", predictionId);
    
    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: { predictionId }
        });

        if (error) {
          console.error("Polling error:", error);
          throw new Error(error.message);
        }
        
        // Increment attempt counter
        setAttempts(prev => prev + 1);
        console.log(`Polling attempt ${attempts + 1}: status = ${data?.success ? "success" : "waiting"}`);

        if (data?.generatedImageUrl) {
          // Image generation is complete
          console.log("Polling complete, image URL received:", data.generatedImageUrl);
          onPredictionComplete(data.generatedImageUrl);
          clearInterval(pollInterval);
          toast.success("AI-generated try-on is ready!");
        } else if (attempts >= MAX_ATTEMPTS) {
          // Give up after max attempts
          clearInterval(pollInterval);
          const errorMsg = "Image generation is taking too long, please try again.";
          console.error(errorMsg);
          if (onPredictionError) onPredictionError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err) {
        console.error("Error polling for prediction:", err);
        if (onPredictionError) onPredictionError(String(err));
      }
    }, 3000); // Poll every 3 seconds

    // Cleanup interval on component unmount or when polling completes
    return () => clearInterval(pollInterval);
  }, [predictionId, onPredictionComplete, onPredictionError, attempts]);

  // This is a utility component that doesn't render anything
  return null;
};

export default PredictionPoller;
