
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wand } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ClothingItem, Outfit } from '@/lib/types';

interface AiTryOnButtonProps {
  selectedOutfit: Outfit | null;
  userPhoto: string | null;
  clothingPhoto?: string | null; // Add optional clothing photo prop
  onGenerationStart: () => void;
  onImageGenerated: (imageUrl: string, predictionId: string | null) => void;
}

const AiTryOnButton = ({
  selectedOutfit,
  userPhoto,
  clothingPhoto,
  onGenerationStart,
  onImageGenerated
}: AiTryOnButtonProps) => {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const generateAITryOn = async () => {
    if (!userPhoto) {
      toast.error("You need to upload a photo first");
      return;
    }

    // Check if we have either a selected outfit or clothing photo
    if (!selectedOutfit && !clothingPhoto) {
      toast.error("You need to select an outfit or clothing item");
      return;
    }

    setIsGeneratingAI(true);
    onGenerationStart();
    
    try {
      // Build prompt based on what's available
      let promptText = "";
      
      if (selectedOutfit) {
        // If an outfit is selected, use its name/description
        promptText = `a photorealistic image of a person wearing ${selectedOutfit.name}`;
      } else if (clothingPhoto) {
        // If only a clothing photo is available, use a generic description
        promptText = "a photorealistic image of a person wearing the provided white t-shirt";
      }
      
      console.log("AI generation prompt:", promptText);
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: promptText,
          userPhotoUrl: userPhoto,
          clothingPhotoUrl: clothingPhoto // Pass the clothing photo URL too
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("AI generation response:", data);
      
      if (data.generatedImageUrl) {
        // Image was generated immediately
        onImageGenerated(data.generatedImageUrl, null);
        toast.success("AI-generated try-on ready!");
      } else if (data.predictionId) {
        // Need to poll for results
        onImageGenerated(data.mockImageUrl || userPhoto, data.predictionId);
        toast("Generating AI try-on image...", {
          description: "This may take a minute or two. We'll notify you when it's ready."
        });
      }
    } catch (error) {
      console.error("Error in AI generation:", error);
      toast.error("Failed to generate AI try-on image");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generateAITryOn}
      disabled={isGeneratingAI || (!selectedOutfit && !clothingPhoto) || !userPhoto}
      className="border-purple-400/30 text-white hover:bg-white/10"
    >
      <Wand className="mr-2 h-4 w-4" />
      {isGeneratingAI ? 'Generating...' : 'AI Try-On'}
    </Button>
  );
};

export default AiTryOnButton;
