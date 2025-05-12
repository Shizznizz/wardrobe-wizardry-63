
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import OutfitCarousel from './OutfitCarousel';
import { Card } from '@/components/ui/card';
import { useSeasonalOutfits } from '@/hooks/useSeasonalOutfits';
import { Outfit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import BlurredSectionOverlay from './BlurredSectionOverlay';

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
    lastUpdated 
  } = useSeasonalOutfits();

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
  
  return (
    <div id="olivia-styles-section" className="mt-8 relative">
      <Card 
        className={`glass-dark border-white/10 overflow-hidden shadow-lg relative
          bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} border border-white/10`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r ${theme.titleGradient}`}>
              <motion.span 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="inline-flex items-center"
              >
                Olivia's Styles {theme.seasonEmoji}
                <motion.div
                  className="ml-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Sparkles className={`h-5 w-5 ${theme.accentColor}`} />
                </motion.div>
              </motion.span>
            </h2>
            
            {lastUpdated && (
              <motion.span 
                className="text-xs text-white/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Updated: {lastUpdated.toLocaleDateString()}
              </motion.span>
            )}
          </div>
          
          <p className="text-white/70 mb-6">
            Personally selected by Olivia to match the season's trends.
          </p>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <Sparkles className="h-8 w-8 text-white/30 mb-3" />
                <p className="text-white/50">Curating styles for you...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-300 mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <OutfitCarousel 
              outfits={outfits} 
              onPreview={onPreviewOutfit}
              title=""
              disabled={!userPhoto}
            />
          )}
        </div>
        
        {/* Overlay when no model is selected */}
        {!userPhoto && (
          <BlurredSectionOverlay 
            onClickChooseModel={onClickChooseModel} 
            customMessage="Choose a photo or Olivia to preview these outfits"
          />
        )}
      </Card>
    </div>
  );
};

export default OliviaStylesSection;
