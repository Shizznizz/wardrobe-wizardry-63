import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sparkle, Cloud, Sun, CloudRain, Thermometer, Clock } from 'lucide-react';
import { Outfit, ClothingItem, TimeOfDay } from '@/lib/types';
import OutfitImageGrid from './OutfitImageGrid';

interface StylingTip {
  title: string;
  description: string;
}

interface WeatherInfo {
  temperature?: string;
  condition?: string;
  icon?: string;
}

interface ActivityInfo {
  activity?: string;
  timeOfDay?: TimeOfDay;
}

export interface OutfitPreviewCardProps {
  outfit: Outfit;
  clothingItems: ClothingItem[];
  getClothingItemById: (id: string) => ClothingItem | undefined;
  stylingTip?: StylingTip;
  weatherInfo?: WeatherInfo;
  activityInfo?: ActivityInfo;
  className?: string;
}

const defaultStylingTip: StylingTip = {
  title: "Perfect Balance",
  description: "This outfit creates a harmonious look by balancing colors and proportions. The pieces work together to create a cohesive style that's both comfortable and fashionable."
};

const getWeatherIcon = (condition?: string) => {
  if (!condition) return <Cloud className="h-4 w-4" />;
  
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
    return <Sun className="h-4 w-4" />;
  }
  if (lowerCondition.includes('rain') || lowerCondition.includes('storm')) {
    return <CloudRain className="h-4 w-4" />;
  }
  return <Cloud className="h-4 w-4" />;
};

const getTimeOfDayDisplay = (timeOfDay?: TimeOfDay) => {
  switch (timeOfDay) {
    case 'morning': return '🌅 Morning';
    case 'afternoon': return '☀️ Afternoon';
    case 'evening': return '🌆 Evening';
    case 'night': return '🌙 Night';
    case 'all-day': return '🕐 All Day';
    default: return '🕐 Anytime';
  }
};

export const OutfitPreviewCard = ({
  outfit,
  clothingItems,
  getClothingItemById,
  stylingTip = defaultStylingTip,
  weatherInfo,
  activityInfo,
  className
}: OutfitPreviewCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const seasons = Array.isArray(outfit.season) ? outfit.season : 
    (Array.isArray(outfit.seasons) ? outfit.seasons : []);
  
  const occasions = Array.isArray(outfit.occasions) ? outfit.occasions : 
    (outfit.occasion ? [outfit.occasion] : []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`h-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="border-white/10 bg-slate-800/50 backdrop-blur-sm h-full relative overflow-hidden group">
        <CardContent className="p-0">
          <div className="flex flex-col md:grid md:grid-cols-2 h-full">
            <div className="relative aspect-square md:aspect-auto overflow-hidden bg-slate-900">
              <OutfitImageGrid 
                itemIds={Array.isArray(outfit.items) ? outfit.items : []} 
                getClothingItemById={getClothingItemById}
                clothingItems={clothingItems}
              />
              
              {(weatherInfo || activityInfo) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                >
                  <div className="text-center text-white space-y-3">
                    {weatherInfo && (
                      <div className="flex items-center justify-center gap-2">
                        {getWeatherIcon(weatherInfo.condition)}
                        <div>
                          {weatherInfo.temperature && (
                            <div className="flex items-center gap-1">
                              <Thermometer className="h-3 w-3" />
                              <span className="text-sm font-medium">{weatherInfo.temperature}</span>
                            </div>
                          )}
                          {weatherInfo.condition && (
                            <p className="text-xs text-white/80">{weatherInfo.condition}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {activityInfo && (
                      <div className="space-y-1">
                        {activityInfo.activity && (
                          <p className="text-sm font-medium">{activityInfo.activity}</p>
                        )}
                        {activityInfo.timeOfDay && (
                          <div className="flex items-center justify-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs text-white/80">
                              {getTimeOfDayDisplay(activityInfo.timeOfDay)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-white text-lg mb-3">{outfit.name || 'Styled Outfit'}</h3>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {seasons.slice(0, 2).map((season) => (
                    <Badge key={`season-${season}`} variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-200">
                      {season}
                    </Badge>
                  ))}
                  
                  {occasions.slice(0, 2).map((occasion) => (
                    <Badge key={`occasion-${occasion}`} variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-200">
                      {occasion}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10 border-2 border-purple-400/30">
                    <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm">OB</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-semibold flex items-center text-white">
                      Olivia's Styling Tip
                      <Sparkle className="h-3 w-3 ml-1.5 text-yellow-400" />
                    </h4>
                    <p className="text-white/70 text-xs">Fashion Stylist</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-white text-sm flex items-center">
                    <Sparkle className="h-3 w-3 mr-1.5 text-yellow-400" />
                    {stylingTip.title}
                  </h5>
                  <p className="text-white/80 text-xs leading-relaxed">{stylingTip.description}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OutfitPreviewCard;
