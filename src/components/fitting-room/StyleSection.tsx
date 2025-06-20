
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RefreshCw, Sparkles } from 'lucide-react';
import { Outfit, WeatherInfo } from '@/lib/types';
import OutfitCard from './OutfitCard';
import BlurredSectionOverlay from './BlurredSectionOverlay';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StyleSectionProps {
  title: string;
  subtitle?: string;
  outfits: Outfit[];
  icon?: React.ReactNode;
  gradientColors?: {
    from: string;
    to: string;
  };
  iconColor?: string;
  titleGradient?: string;
  onPreviewOutfit: (outfit: Outfit) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  userPhoto: string | null;
  onClickChooseModel: () => void;
  lastUpdated?: Date;
  isRefreshing?: boolean;
  className?: string;
  showTrending?: boolean;
  fallbackContent?: React.ReactNode;
  weatherInfo?: WeatherInfo;
}

const StyleSection: React.FC<StyleSectionProps> = ({
  title,
  subtitle,
  outfits = [],
  icon,
  gradientColors = { from: 'from-slate-800/80', to: 'to-slate-900/80' },
  iconColor = 'text-purple-400',
  titleGradient = 'from-blue-200 to-purple-300',
  onPreviewOutfit,
  onRefresh,
  isLoading = false,
  userPhoto,
  onClickChooseModel,
  lastUpdated,
  isRefreshing = false,
  className = '',
  showTrending = false,
  fallbackContent,
  weatherInfo
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Olivia's Current Faves - fallback outfits when no outfits are available
  const oliviaFavorites: Outfit[] = [
    {
      id: "olivia-fave-1",
      name: "Spring Casual",
      notes: "Olivia loves this relaxed yet put-together look for spring days",
      items: [],
      seasons: ["spring"],
      occasions: ["casual", "everyday"],
      favorite: true,
      dateAdded: new Date()
    },
    {
      id: "olivia-fave-2",
      name: "Weekend Brunch",
      notes: "Perfect for weekend brunches or coffee dates",
      items: [],
      seasons: ["spring", "summer"],
      occasions: ["casual", "brunch"],
      favorite: true,
      dateAdded: new Date()
    },
    {
      id: "olivia-fave-3",
      name: "Office Chic",
      notes: "Professional but stylish outfit for the office",
      items: [],
      seasons: ["all"],
      occasions: ["work", "business"],
      favorite: true,
      dateAdded: new Date()
    }
  ];
  
  // Determine which outfits to display - use Olivia's faves if no outfits provided
  const displayOutfits = outfits.length > 0 ? outfits : (showTrending ? oliviaFavorites : outfits);
  
  // Adjust title if showing fallback outfits
  const displayTitle = (outfits.length === 0 && showTrending && displayOutfits.length > 0) 
    ? "Olivia's Current Faves" 
    : title;
  
  // Determine if we should show the carousel or not
  const showCarousel = !isLoading && displayOutfits.length > 0;
  
  // Determine weather-related info
  const showWeatherInfo = weatherInfo && (weatherInfo.temperature !== undefined || weatherInfo.condition);
  
  return (
    <div className={`mt-8 relative ${className}`}>
      <Card 
        className={`glass-dark border-white/10 overflow-hidden shadow-lg relative
          bg-gradient-to-br ${gradientColors.from} ${gradientColors.to} border border-white/10`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r ${titleGradient}`}>
              <motion.span 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="inline-flex items-center"
              >
                {displayTitle}
                {icon && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {React.isValidElement(icon) ? 
                      React.cloneElement(icon, { 
                        style: { marginLeft: '0.5rem' },
                        className: `h-5 w-5 ml-2 ${iconColor}` 
                      } as React.HTMLAttributes<HTMLElement>) : 
                      icon
                    }
                  </motion.div>
                )}
              </motion.span>
            </h2>
            
            <div className="flex items-center gap-2">
              {showWeatherInfo && (
                <div className="text-xs text-white/60 flex items-center gap-1">
                  {weatherInfo?.condition && (
                    <span>{weatherInfo.condition}</span>
                  )}
                  {weatherInfo?.temperature !== undefined && (
                    <span>{weatherInfo.temperature}°C</span>
                  )}
                </div>
              )}
              
              {outfits.length === 0 && showTrending && displayOutfits.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-white/50 flex items-center">
                        <Sparkles className="h-3 w-3 mr-1 text-yellow-400" />
                        <span>Updates daily</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 border-white/10 text-white">
                      <p>This section updates every 24h based on what users are wearing.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
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
              
              {onRefresh && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              )}
            </div>
          </div>
          
          {subtitle && (
            <p className="text-white/70 mb-6">
              {subtitle}
            </p>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center h-[420px]">
              <div className="animate-pulse flex flex-col items-center">
                {icon && React.isValidElement(icon) ? 
                  React.cloneElement(icon, { 
                    className: "h-8 w-8 text-white/30 mb-3",
                    style: {}
                  } as React.HTMLAttributes<HTMLElement>) : 
                  null
                }
                <p className="text-white/50">Loading styles for you...</p>
              </div>
            </div>
          ) : showCarousel ? (
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
                  onClick={handleScrollLeft}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              </div>
              
              <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-4 pl-12 pr-12 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
                style={{ scrollbarWidth: 'thin' }}
              >
                {displayOutfits.map((outfit, index) => (
                  <div key={outfit.id || index} className="flex-shrink-0 w-[300px]">
                    <OutfitCard
                      outfit={outfit}
                      onPreview={onPreviewOutfit}
                      disabled={!userPhoto}
                      isHighlighted={index === 0}
                      isTrending={showTrending}
                    />
                  </div>
                ))}
              </div>
              
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
                  onClick={handleScrollRight}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </div>
          ) : (
            // Center content when no outfits - use fallback content if provided
            <div className="mx-auto w-full flex items-center justify-center h-[420px] text-white/50">
              {fallbackContent ? (
                fallbackContent
              ) : (
                <div className="text-center">
                  <p>No outfits available</p>
                  {onRefresh && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 border-white/10 hover:border-white/20"
                      onClick={onRefresh}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Overlay when no model is selected */}
        {!userPhoto && (
          <BlurredSectionOverlay 
            onClickChooseModel={onClickChooseModel} 
            customMessage={`Choose a photo or Olivia to preview these outfits`}
          />
        )}
      </Card>
    </div>
  );
};

export default StyleSection;
