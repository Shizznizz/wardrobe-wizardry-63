
import { useState, useEffect } from 'react';
import { Outfit, ClothingItem } from '@/lib/types';
import OliviaRecommendation from '@/components/outfits/OliviaRecommendation';
import { toast } from 'sonner';

interface OliviaRecommendationSectionProps {
  weather: {
    temperature: number;
    condition: string;
  };
  situation: string;
  clothingItems: ClothingItem[]; // Added clothingItems prop
}

const OliviaRecommendationSection = ({ weather, situation, clothingItems }: OliviaRecommendationSectionProps) => {
  const [isGenerating, setIsGenerating] = useState(true);

  // Simulate generating a recommendation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
      toast.success("Olivia has created an outfit for you!");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center p-12 bg-slate-900/50 border border-white/10 rounded-xl">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-purple-500 rounded-full animate-spin mb-4"></div>
          <p className="text-white/80">Olivia is creating your personalized outfit...</p>
        </div>
      </div>
    );
  }

  return (
    <OliviaRecommendation 
      weather={{
        temperature: weather.temperature,
        condition: weather.condition
      }}
      situation={situation}
    />
  );
};

export default OliviaRecommendationSection;
