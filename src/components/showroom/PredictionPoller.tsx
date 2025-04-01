
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PredictionPollerProps {
  predictionId: string | null;
  onPredictionComplete: (imageUrl: string) => void;
}

const PredictionPoller = ({ predictionId, onPredictionComplete }: PredictionPollerProps) => {
  useEffect(() => {
    if (!predictionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: { predictionId }
        });

        if (error) throw new Error(error.message);

        if (data.generatedImageUrl) {
          // Image generation is complete
          onPredictionComplete(data.generatedImageUrl);
          clearInterval(pollInterval);
          toast.success("AI-generated try-on is ready!");
        }
      } catch (err) {
        console.error("Error polling for prediction:", err);
      }
    }, 3000);

    // Cleanup interval on component unmount or when polling completes
    return () => clearInterval(pollInterval);
  }, [predictionId, onPredictionComplete]);

  // This is a utility component that doesn't render anything
  return null;
};

export default PredictionPoller;
