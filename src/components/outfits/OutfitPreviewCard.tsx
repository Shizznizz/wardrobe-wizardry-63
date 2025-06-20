import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Thermometer, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Outfit, ClothingItem, WeatherInfo } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface OutfitPreviewCardProps {
  outfit: Outfit;
  clothingItems: ClothingItem[];
  weather?: WeatherInfo;
  activitySuggestion?: string;
  oliviaTip?: string;
  onCardClick?: (outfit: Outfit) => void;
  className?: string;
}

const OutfitPreviewCard = ({
  outfit,
  clothingItems,
  weather,
  activitySuggestion,
  oliviaTip,
  onCardClick,
  className
}: OutfitPreviewCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isMobile = useIsMobile();
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const outfitItems = outfit.items
    ?.map(itemId => clothingItems.find(item => item.id === itemId))
    .filter(Boolean) || [];

  const defaultOliviaTip = oliviaTip || generateOliviaTip(outfit, weather, activitySuggestion);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setIsPressed(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY;
    setIsPressed(false);
    
    const deltaY = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0 && !showDetails) {
        setShowDetails(true);
      } else if (deltaY < 0 && showDetails) {
        setShowDetails(false);
      }
    }
  };

  const handleCardInteraction = () => {
    if (isMobile) {
      setShowDetails(!showDetails);
    }
    onCardClick?.(outfit);
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setShowDetails(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setShowDetails(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isMobile ? { scale: 1.02, y: -4 } : {}}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-slate-900/70 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg",
        "hover:border-purple-400/30 hover:shadow-purple-500/10 hover:shadow-xl",
        "cursor-pointer transition-all duration-300",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardInteraction}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {outfitItems.slice(0, 4).map((item, index) => (
            <div
              key={item?.id || index}
              className="aspect-square bg-slate-800/50 rounded-lg overflow-hidden border border-white/5"
            >
              <img
                src={item?.imageUrl || '/placeholder.svg'}
                alt={item?.name || `Item ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {outfitItems.length < 4 && (
            Array.from({ length: 4 - outfitItems.length }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="aspect-square bg-slate-800/30 rounded-lg border border-white/5 flex items-center justify-center"
              >
                <span className="text-white/30 text-xs">+</span>
              </div>
            ))
          )}
        </div>

        <div className="mb-3">
          <h3 className="font-semibold text-white text-lg mb-2">{outfit.name}</h3>
          <div className="flex flex-wrap gap-1.5">
            {outfit.seasons?.slice(0, 2).map(season => (
              <Badge
                key={season}
                variant="outline"
                className="text-xs bg-blue-500/20 border-blue-500/30 text-blue-300"
              >
                {season}
              </Badge>
            ))}
            {outfit.occasions?.slice(0, 2).map(occasion => (
              <Badge
                key={occasion}
                variant="outline"
                className="text-xs bg-purple-500/20 border-purple-500/30 text-purple-300"
              >
                {occasion}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8 border-2 border-purple-400/50 flex-shrink-0">
              <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs">OB</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-purple-300 mb-1">Olivia's Tip</h4>
              <p className="text-white/80 text-sm leading-relaxed">{defaultOliviaTip}</p>
            </div>
          </div>
        </div>
      </div>

      <Collapsible open={showDetails} onOpenChange={setShowDetails}>
        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10 bg-slate-800/30 p-4 space-y-3"
          >
            {weather && (
              <div className="flex items-center space-x-3 text-sm">
                <Thermometer className="h-4 w-4 text-blue-400" />
                <span className="text-white/80">
                  Perfect for {weather.temperature}°C, {weather.condition.toLowerCase()}
                </span>
              </div>
            )}

            {activitySuggestion && (
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="h-4 w-4 text-green-400" />
                <span className="text-white/80">Great for: {activitySuggestion}</span>
              </div>
            )}

            {weather?.city && (
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span className="text-white/80">Styled for {weather.city}</span>
              </div>
            )}
          </motion.div>
        </CollapsibleContent>

        {isMobile && (
          <CollapsibleTrigger asChild>
            <div className="flex justify-center py-2 border-t border-white/10">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                {showDetails ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Less Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    More Details
                  </>
                )}
              </Button>
            </div>
          </CollapsibleTrigger>
        )}
      </Collapsible>
    </motion.div>
  );
};

const generateOliviaTip = (outfit: Outfit, weather?: WeatherInfo, activity?: string): string => {
  const tips = [
    `This ${outfit.name.toLowerCase()} combination creates a perfect balance of style and comfort.`,
    `I love how the colors in this outfit complement each other beautifully.`,
    `This look is versatile enough to transition from day to night effortlessly.`,
    `The silhouette of this outfit is incredibly flattering and on-trend.`,
    `This combination shows off your personal style while staying practical.`
  ];

  if (weather && weather.temperature < 15) {
    tips.push(`Perfect for cooler weather - the layers will keep you warm and stylish.`);
  } else if (weather && weather.temperature > 25) {
    tips.push(`Ideal for warm weather - breathable fabrics that keep you cool and chic.`);
  }

  if (activity) {
    tips.push(`This outfit is perfectly suited for ${activity.toLowerCase()} - stylish yet appropriate.`);
  }

  return tips[Math.floor(Math.random() * tips.length)];
};

export default OutfitPreviewCard;
