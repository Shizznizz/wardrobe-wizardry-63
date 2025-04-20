
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightCircle, ShoppingBag, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Outfit, WeatherInfo } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { sampleOutfits } from '@/lib/wardrobeData';

// Import our existing recommendation component
import OliviaRecommendation from '@/components/outfits/OliviaRecommendation';

interface OliviaRecommendationSectionProps {
  weather: WeatherInfo | null;
  situation?: string | null;
}

const OliviaRecommendationSection = ({ weather, situation }: OliviaRecommendationSectionProps) => {
  const navigate = useNavigate();
  
  const handleTryOnOutfit = () => {
    toast.success("Opening fitting room with this outfit!");
    navigate('/fitting-room');
  };
  
  const handleSaveOutfit = () => {
    toast.success("Outfit saved to your collection!");
  };
  
  const handleShopSimilarLook = () => {
    toast.success("Taking you to shop similar items!");
    navigate('/shop-and-try');
  };
  
  // Create a safe weather object for when weather is null
  const safeWeather: WeatherInfo = weather || {
    temperature: 18,
    condition: 'clear',
    icon: 'sun',
    city: 'Unknown',
    country: 'Unknown'
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Your Daily Outfit from Olivia
        </h2>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm text-white border-purple-400/30 px-3 py-1.5"
              >
                Style Recommendation
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900/95 border-purple-500/20 text-white">
              <p>Picked for you based on today's weather in {safeWeather.city || 'your area'} and your preferences.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <OliviaRecommendation 
          weather={safeWeather} 
          situation={situation || undefined}
        />
      </div>
      
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
        <Button 
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md shadow-purple-900/20"
          onClick={handleTryOnOutfit}
        >
          <ArrowRightCircle className="mr-2 h-5 w-5" /> Try on Olivia
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          className="border-purple-400/30 text-white hover:bg-white/10"
          onClick={handleSaveOutfit}
        >
          <Save className="mr-2 h-5 w-5" /> Save to My Collection
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          className="border-blue-400/30 text-white hover:bg-white/10"
          onClick={handleShopSimilarLook}
        >
          <ShoppingBag className="mr-2 h-5 w-5" /> Shop Similar Look
        </Button>
      </div>
    </div>
  );
};

export default OliviaRecommendationSection;
