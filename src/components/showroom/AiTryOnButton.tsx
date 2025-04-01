
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wand } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ClothingItem, Outfit } from '@/lib/types';

interface AiTryOnButtonProps {
  selectedOutfit: Outfit | null;
  userPhoto: string | null;
  onGenerationStart: () => void;
  onImageGenerated: (imageUrl: string, predictionId: string | null) => void;
}

const AiTryOnButton = ({
  selectedOutfit,
  userPhoto,
  onGenerationStart,
  onImageGenerated
}: AiTryOnButtonProps) => {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const generateAITryOn = async () => {
    if (!selectedOutfit || !userPhoto) {
      toast.error("You need both a photo and an outfit selected");
      return;
    }

    setIsGeneratingAI(true);
    onGenerationStart();
    
    try {
      const outfitItems = selectedOutfit.items.map(id => {
        // Just use the outfit name for the prompt
        return selectedOutfit.name;
      }).filter(Boolean).join(", ");
      
      const prompt = `a photorealistic image of a person wearing ${outfitItems}`;
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt,
          userPhotoUrl: userPhoto
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
      disabled={isGeneratingAI || !selectedOutfit || !userPhoto}
      className="border-purple-400/30 text-white hover:bg-white/10"
    >
      <Wand className="mr-2 h-4 w-4" />
      {isGeneratingAI ? 'Generating...' : 'AI Try-On'}
    </Button>
  );
};

export default AiTryOnButton;
