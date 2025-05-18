
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Outfit } from '@/lib/types';
import { trackOutfitUsage } from '@/utils/outfitTracking';
import StyleSection from './StyleSection';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useOliviaOutfitSuggestions } from '@/hooks/useOliviaOutfitSuggestions';

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
  const navigate = useNavigate();
  const { 
    outfits, 
    season, 
    isLoading, 
    weather,
    refreshOutfits,
    isGenerating
  } = useOliviaOutfitSuggestions();

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
  
  // Get weather info from current weather state
  const weatherInfo = weather ? {
    temperature: weather.temperature,
    condition: weather.condition
  } : {
    temperature: 22,
    condition: 'Sunny'
  };

  // Handle navigation to wardrobe
  const handleGoToWardrobe = () => {
    navigate('/wardrobe');
  };
  
  // Create fallback content when no outfits can be generated
  const fallbackContent = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Sparkles className="h-8 w-8 text-purple-400 mb-3 opacity-50" />
      <p className="text-white/80 mb-6">
        Olivia couldn't find enough matching items to create seasonal outfits. 
        Try adding a top, bottom, and shoes to your wardrobe.
      </p>
      <Button
        onClick={handleGoToWardrobe}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        Go to My Wardrobe
      </Button>
    </div>
  );
  
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
      lastUpdated={new Date()}
      isRefreshing={isGenerating}
      fallbackContent={fallbackContent}
      weatherInfo={weatherInfo}
    />
  );
};

export default OliviaStylesSection;
