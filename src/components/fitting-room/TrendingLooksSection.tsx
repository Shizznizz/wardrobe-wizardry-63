
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Outfit } from '@/lib/types';
import { useTrendingOutfits } from '@/hooks/useTrendingOutfits';
import { trackOutfitUsage } from '@/utils/outfitTracking';
import StyleSection from './StyleSection';

interface TrendingLooksSectionProps {
  onPreviewOutfit: (outfit: Outfit) => void;
  userPhoto: string | null;
  onClickChooseModel: () => void;
}

const TrendingLooksSection: React.FC<TrendingLooksSectionProps> = ({ 
  onPreviewOutfit, 
  userPhoto, 
  onClickChooseModel 
}) => {
  const { 
    outfits, 
    isLoading, 
    error,
    lastUpdated,
    refreshOutfits 
  } = useTrendingOutfits();

  // Handle outfit preview and track the usage
  const handlePreviewOutfit = async (outfit: Outfit) => {
    // Track outfit usage in Supabase
    if (outfit.id) {
      await trackOutfitUsage(outfit.id, 'tried');
    }
    
    // Preview the outfit
    onPreviewOutfit(outfit);
  };
  
  return (
    <StyleSection
      title="Trending Now 🔥"
      subtitle="These looks are trending among our users."
      outfits={outfits}
      icon={<TrendingUp />}
      gradientColors={{
        from: 'from-purple-600/20',
        to: 'to-pink-600/20'
      }}
      iconColor="text-pink-400"
      titleGradient="from-purple-200 to-pink-300"
      onPreviewOutfit={handlePreviewOutfit}
      onRefresh={refreshOutfits}
      isLoading={isLoading}
      userPhoto={userPhoto}
      onClickChooseModel={onClickChooseModel}
      lastUpdated={lastUpdated}
      showTrending={true}
    />
  );
};

export default TrendingLooksSection;
