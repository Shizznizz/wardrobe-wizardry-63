
import React from 'react';
import { motion } from 'framer-motion';
import { WeatherInfo } from '@/lib/types';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import DailyOutfitSection from './DailyOutfitSection';

interface OliviaRecommendationSectionProps {
  weather: WeatherInfo | null;
  situation: string | null;
}

const OliviaRecommendationSection = ({ weather, situation }: OliviaRecommendationSectionProps) => {
  // Find an outfit that matches the situation
  const getSituationOutfit = () => {
    if (!situation) return sampleOutfits[0];
    
    const matchingOutfits = sampleOutfits.filter(outfit => 
      outfit.tags?.some(tag => tag.toLowerCase().includes(situation.toLowerCase()))
    );
    
    return matchingOutfits.length > 0 ? matchingOutfits[0] : sampleOutfits[0];
  };

  const recommendedOutfit = getSituationOutfit();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <DailyOutfitSection 
        weather={weather || undefined} 
        currentOutfit={recommendedOutfit}
        clothingItems={sampleClothingItems}
        situation={situation || undefined}
      />
    </motion.div>
  );
};

export default OliviaRecommendationSection;
