import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outfit, ClothingItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Thermometer, MapPin, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface WeatherInfo {
  temperature: number;
  condition: string;
  city: string;
}

interface OutfitPreviewCardProps {
  outfit: Outfit;
  clothingItems: ClothingItem[];
  weather?: WeatherInfo;
  activitySuggestion?: string;
  onCardClick?: (outfit: Outfit) => void;
  compact?: boolean;
}

const OutfitPreviewCard = ({ 
  outfit, 
  clothingItems, 
  weather, 
  activitySuggestion, 
  onCardClick,
  compact = false
}: OutfitPreviewCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const isMobile = useIsMobile();

  const getItemsByType = (type: string) => {
    if (!outfit.items || !Array.isArray(outfit.items)) return [];
    return outfit.items
      .map(itemId => clothingItems.find(item => item.id === itemId))
      .filter(item => item && item.type.toLowerCase() === type.toLowerCase());
  };

  const tops = getItemsByType('top');
  const bottoms = getItemsByType('bottom');
  const shoes = getItemsByType('shoes');
  const accessories = getItemsByType('accessories');

  const allItems = [
    { type: 'Top', items: tops, placeholder: '👕' },
    { type: 'Bottom', items: bottoms, placeholder: '👖' },
    { type: 'Shoes', items: shoes, placeholder: '👟' },
    { type: 'Accessories', items: accessories, placeholder: '👜' }
  ];

  const generateOliviaTip = () => {
    const totalItems = outfit.items?.length || 0;
    const occasions = outfit.occasions || [];
    const seasons = outfit.seasons || outfit.season || [];
    const isAISuggested = outfit.personality_tags?.includes('olivia-suggested');
    
    if (isAISuggested) {
      const daySpecificTips = [
        `I chose this combination considering today's weather and your style preferences!`,
        `This ${totalItems}-piece look balances comfort and style perfectly for your day.`,
        `The colors work beautifully together and complement the season.`,
        `I made sure this outfit uses different pieces from your other weekly looks!`,
        `Perfect for ${occasions.join(' and ') || 'your planned activities'} - you'll feel confident and comfortable.`
      ];
      return daySpecificTips[Math.floor(Math.random() * daySpecificTips.length)];
    }
    
    const tips = [
      `Perfect for ${activitySuggestion || 'your day'}! This ${totalItems}-piece look is effortlessly chic.`,
      `Love this combination! The colors work beautifully together for ${occasions.join(' and ') || 'any occasion'}.`,
      `This outfit screams confidence! Perfect for ${weather?.condition?.toLowerCase() || 'today\'s weather'}.`,
      `Such a versatile look! You can dress it up or down depending on your mood.`,
      `The layering in this outfit is spot-on! Great choice for ${seasons.join(' and ') || 'the season'}.`
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  };

  const oliviaTip = generateOliviaTip();

  const handleTouchStart = () => {
    setTouchStartTime(Date.now());
  };

  const handleTouchEnd = () => {
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration < 300 && isMobile) {
      setIsDetailsOpen(!isDetailsOpen);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsDetailsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsDetailsOpen(false);
    }
  };

  return (
    <motion.div
      className={`bg-slate-900/70 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${compact ? 'min-h-[280px]' : ''}`}
      whileHover={{ scale: compact ? 1.01 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onCardClick?.(outfit)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={compact ? "p-4" : "p-6"}>
        <div className={`grid grid-cols-2 gap-3 ${compact ? "mb-4" : "mb-6"}`}>
          {allItems.map(({ type, items, placeholder }) => (
            <div key={type} className="aspect-square bg-slate-800/50 rounded-lg border border-white/10 overflow-hidden relative group/item">
              {items.length > 0 ? (
                <div className="relative w-full h-full">
                  <img
                    src={items[0].imageUrl || '/placeholder-clothing.png'}
                    alt={items[0].name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                  />
                  {items.length > 1 && (
                    <div className="absolute top-1 right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      +{items.length - 1}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40">
                  <span className="text-2xl">{placeholder}</span>
                </div>
              )}
              <div className="absolute bottom-1 left-1 right-1">
                <p className="text-xs text-white/80 bg-black/50 rounded px-1 py-0.5 truncate">
                  {items.length > 0 ? items[0].name : type}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className={`border-2 border-purple-400/50 ${compact ? "h-6 w-6" : "h-8 w-8"}`}>
              <AvatarImage src="/olivia-avatar.png" alt="Olivia" />
              <AvatarFallback className="bg-purple-500 text-white text-sm">O</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className={`text-purple-200 font-medium mb-1 ${compact ? "text-xs" : "text-sm"}`}>Olivia's Tip</p>
              <p className={`text-white/80 leading-relaxed ${compact ? "text-xs" : "text-xs"}`}>{oliviaTip}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {outfit.occasions && outfit.occasions.map((occasion) => (
              <Badge key={occasion} variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                {occasion}
              </Badge>
            ))}
            {(outfit.seasons || outfit.season) && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                {Array.isArray(outfit.seasons) ? outfit.seasons.join(', ') : outfit.season}
              </Badge>
            )}
          </div>

          <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <AnimatePresence>
              {isDetailsOpen && (
                <CollapsibleContent forceMount>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 pt-3 border-t border-white/10"
                  >
                    {weather && (
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Thermometer className="h-4 w-4 text-blue-400" />
                        <span>{weather.temperature}°C • {weather.condition}</span>
                        <MapPin className="h-4 w-4 text-green-400 ml-2" />
                        <span>{weather.city}</span>
                      </div>
                    )}
                    
                    {activitySuggestion && (
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Calendar className="h-4 w-4 text-orange-400" />
                        <span>Perfect for {activitySuggestion}</span>
                      </div>
                    )}

                    <div className="text-xs text-white/60">
                      <p>Tap to see outfit details • Swipe for more options</p>
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
            
            {isMobile && (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full mt-2 text-white/60 hover:text-white">
                  {isDetailsOpen ? (
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
              </CollapsibleTrigger>
            )}
          </Collapsible>
        </div>
      </div>
    </motion.div>
  );
};

export default OutfitPreviewCard;
