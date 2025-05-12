
import React from 'react';
import { Sparkles } from 'lucide-react';
import { useSeasonalOutfits } from '@/hooks/useSeasonalOutfits';
import { Outfit } from '@/lib/types';
import { trackOutfitUsage } from '@/utils/outfitTracking';
import StyleSection from './StyleSection';

interface OliviaStylesSectionProps {
  onPreviewOutfit: (outfit: Outfit) => void;
  userPhoto: string | null;
  onClickChooseModel: () => void;
}

const OliviaStylesSection: React.FC<OliviaStylesSectionProps> = ({ 
  onPreviewOutfit, 
  userPhoto, 
  onClickChooseModel 
}) => {
  const { 
    outfits, 
    season, 
    isLoading, 
    error,
    lastUpdated,
    refreshOutfits,
    isRefreshing
  } = useSeasonalOutfits();

  // Handle outfit preview and track the usage
  const handlePreviewOutfit = async (outfit: Outfit) => {
    // Track outfit usage in Supabase
    if (outfit.id) {
      await trackOutfitUsage(outfit.id, 'tried');
    }
    
    // Preview the outfit
    onPreviewOutfit(outfit);
  };
  
  // Seasonal color schemes
  const seasonalTheme = {
    winter: {
      gradientFrom: 'from-blue-500/20',
      gradientTo: 'to-purple-500/20',
      accentColor: 'text-blue-200',
      titleGradient: 'from-blue-200 to-purple-300',
      seasonEmoji: '❄️'
    },
    spring: {
      gradientFrom: 'from-green-500/20',
      gradientTo: 'to-pink-500/20',
      accentColor: 'text-green-200',
      titleGradient: 'from-green-200 to-pink-300',
      seasonEmoji: '🌸'
    },
    summer: {
      gradientFrom: 'from-yellow-500/20',
      gradientTo: 'to-orange-500/20',
      accentColor: 'text-yellow-200',
      titleGradient: 'from-yellow-200 to-orange-300',
      seasonEmoji: '☀️'
    },
    autumn: {
      gradientFrom: 'from-orange-500/20',
      gradientTo: 'to-red-500/20',
      accentColor: 'text-orange-200',
      titleGradient: 'from-orange-200 to-amber-300',
      seasonEmoji: '🍂'
    }
  };
  
  // Choose theme based on current season
  const theme = seasonalTheme[season as keyof typeof seasonalTheme] || seasonalTheme.autumn;
  const weatherInfo = {
    temperature: 22,
    condition: 'Sunny'
  };
  
  return (
    <StyleSection
      title={`Olivia's Styles ${theme.seasonEmoji}`}
      subtitle="Personally selected by Olivia to match the season's trends."
      outfits={outfits}
      icon={<Sparkles />}
      gradientColors={{
        from: theme.gradientFrom,
        to: theme.gradientTo
      }}
      iconColor={theme.accentColor}
      titleGradient={theme.titleGradient}
      onPreviewOutfit={handlePreviewOutfit}
      onRefresh={refreshOutfits}
      isLoading={isLoading}
      userPhoto={userPhoto}
      onClickChooseModel={onClickChooseModel}
      lastUpdated={lastUpdated}
      isRefreshing={isRefreshing}
    />
  );
};

export default OliviaStylesSection;
