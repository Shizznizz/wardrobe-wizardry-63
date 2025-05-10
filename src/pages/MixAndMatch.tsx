
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Outfit } from '@/lib/types';

import DailyOutfitSection from '@/components/outfits/mix-match/DailyOutfitSection';
import EnhancedWeatherSection from '@/components/outfits/mix-match/EnhancedWeatherSection';
import SuggestedOutfitsSection from '@/components/outfits/mix-match/SuggestedOutfitsSection';
import OliviaRecommendationSection from '@/components/outfits/mix-match/OliviaRecommendationSection';
import CreateOutfitSection from '@/components/outfits/mix-match/CreateOutfitSection';
import { useAuth } from '@/hooks/useAuth';
import { useWardrobeData } from '@/hooks/useWardrobeData';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const MixAndMatch = () => {
  const { isAuthenticated, user } = useAuth();
  const { clothingItems, outfits, isLoadingItems, isLoadingOutfits } = useWardrobeData();
  
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [temperature, setTemperature] = useState(72);
  const [weatherCondition, setWeatherCondition] = useState('clear');
  const [situation, setSituation] = useState('casual');
  
  const handleStyleMe = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to get personalized outfit recommendations");
      return;
    }
    
    if (clothingItems.length === 0) {
      toast.warning("Please add some clothing items to your wardrobe first");
      return;
    }
    
    setShowRecommendation(true);
    toast.success("Generating outfit recommendations...");
    
    // Scroll to recommendation section
    setTimeout(() => {
      const recommendationSection = document.getElementById('olivia-recommendation');
      if (recommendationSection) {
        recommendationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
  };

  // Handle weather section updates
  const handleWeatherUpdate = (weatherInfo: any) => {
    if (weatherInfo.temperature) {
      setTemperature(weatherInfo.temperature);
    }
    if (weatherInfo.condition) {
      setWeatherCondition(weatherInfo.condition.toLowerCase());
    }
  };

  const handleSituationChange = (newSituation: string) => {
    setSituation(newSituation);
  };
  
  // Show authentication notice if user is not logged in
  const renderAuthNotice = () => {
    if (!isAuthenticated) {
      return (
        <Alert variant="warning" className="mb-6 bg-amber-900/20 border-amber-500/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in to see your outfits and get personalized recommendations.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };
  
  // Show empty state if authenticated but no items
  const renderEmptyWardrobeNotice = () => {
    if (isAuthenticated && !isLoadingItems && clothingItems.length === 0) {
      return (
        <Alert variant="warning" className="mb-6 bg-blue-900/20 border-blue-500/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Empty Wardrobe</AlertTitle>
          <AlertDescription>
            Add some clothing items to your wardrobe to create outfits.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <EnhancedHeroSection
        title="Your Daily Style, Curated by Olivia"
        subtitle="Olivia creates outfits that reflect your vibe, wardrobe, and even the weather."
        image={{
          src: "/lovable-uploads/c1e6bf5e-6916-4ef2-b396-c00b6c7086f2.png",
          alt: "Woman in beige linen two-piece with hat"
        }}
        buttons={[
          {
            label: "Let Olivia Style Me Today",
            onClick: handleStyleMe,
            variant: "gradient"
          }
        ]}
      />
      
      <div className="container mx-auto px-4 space-y-10 pt-6 pb-20">
        {renderAuthNotice()}
        {renderEmptyWardrobeNotice()}
        
        <EnhancedWeatherSection 
          onWeatherUpdate={handleWeatherUpdate}
          onSituationChange={handleSituationChange}
          onTemperatureChange={setTemperature}
          onWeatherConditionChange={setWeatherCondition}
          temperature={temperature}
          weatherCondition={weatherCondition}
        />
        
        {isAuthenticated && (
          <>
            <DailyOutfitSection 
              clothingItems={clothingItems} 
              currentOutfit={currentOutfit}
              isLoading={isLoadingItems} 
            />
            
            <SuggestedOutfitsSection 
              clothingItems={clothingItems} 
              outfits={outfits}
              weather={{
                temperature,
                condition: weatherCondition
              }}
              isLoading={isLoadingOutfits}
            />
            
            {showRecommendation && (
              <div id="olivia-recommendation">
                <OliviaRecommendationSection 
                  weather={{
                    temperature,
                    condition: weatherCondition
                  }}
                  situation={situation}
                  clothingItems={clothingItems}
                />
              </div>
            )}
            
            <CreateOutfitSection 
              clothingItems={clothingItems}
              isPremium={isAuthenticated}
              isLoading={isLoadingItems}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MixAndMatch;
