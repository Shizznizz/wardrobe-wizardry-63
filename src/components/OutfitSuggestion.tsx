
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClothingItem, Outfit, WeatherInfo, TimeOfDay, Activity } from '@/lib/types';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Thermometer, 
  RefreshCw, 
  ThermometerSun, 
  Shirt, 
  PanelBottom, 
  Heart, 
  Stars, 
  Sun, 
  Moon,
  Briefcase,
  Dumbbell,
  PartyPopper,
  Coffee,
  HeartHandshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface OutfitSuggestionProps {
  outfit: Outfit;
  items: ClothingItem[];
  weather?: WeatherInfo;
  timeOfDay?: TimeOfDay;
  activity?: Activity;
  onWear: () => void;
  onRefresh: () => void;
  onLike: () => void;
  onDislike: () => void;
  onMakeWarmer: () => void;
  onChangeTop: () => void;
  onChangeBottom: () => void;
  onToggleFavorite: () => void;
}

const OutfitSuggestion: React.FC<OutfitSuggestionProps> = ({
  outfit,
  items,
  weather,
  timeOfDay,
  activity,
  onWear,
  onRefresh,
  onLike,
  onDislike,
  onMakeWarmer,
  onChangeTop,
  onChangeBottom,
  onToggleFavorite
}) => {
  const isMobile = useIsMobile();
  
  // Filter the items to only show the ones in the outfit
  const outfitItems = outfit.items
    .map(id => items.find(item => item.id === id))
    .filter(item => item !== undefined) as ClothingItem[];

  const getActivityIcon = (activity?: Activity) => {
    if (!activity) return null;
    
    switch (activity) {
      case 'work':
        return <Briefcase className="h-4 w-4" />;
      case 'sport':
        return <Dumbbell className="h-4 w-4" />;
      case 'party':
        return <PartyPopper className="h-4 w-4" />;
      case 'date':
        return <HeartHandshake className="h-4 w-4" />;
      case 'casual':
        return <Coffee className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTimeIcon = (time?: TimeOfDay) => {
    if (!time) return null;
    
    if (time === 'morning' || time === 'afternoon') {
      return <Sun className="h-4 w-4" />;
    } else {
      return <Moon className="h-4 w-4" />;
    }
  };

  return (
    <div className="py-2">
      <div className="mb-3 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">
          {outfit.name}
          {outfit.favorite && (
            <Heart className="inline-block ml-2 h-5 w-5 text-pink-400 fill-pink-400" />
          )}
        </h3>
        
        <div className="flex gap-1">
          {outfit.personalityTags?.map(tag => (
            <Badge key={tag} variant="outline" className="bg-white/10 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <AnimatePresence>
          {outfitItems.map((item, index) => (
            <motion.div 
              key={`${outfit.id}-${item.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative group"
            >
              <Card className="overflow-hidden bg-black/20 border border-white/10 h-full">
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <div className="text-white text-sm font-medium truncate">{item.name}</div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <Badge variant="outline" className="bg-black/30 text-white text-xs border-white/20">
                        {item.type}
                      </Badge>
                      <Badge variant="outline" className="bg-black/30 text-xs border-white/20" style={{ color: `var(--${item.color})` }}>
                        {item.color}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="glass-dark p-4 rounded-xl mt-4 border border-white/10">
        <div className="flex flex-wrap gap-2 mb-3">
          {outfit.seasons.map(season => (
            <Badge key={season} className="bg-gradient-to-r from-blue-500/40 to-purple-500/40 text-white">
              {season}
            </Badge>
          ))}
          
          {outfit.occasions.map(occasion => (
            <Badge key={occasion} variant="outline" className="bg-white/10 text-white">
              {occasion}
            </Badge>
          ))}
          
          {timeOfDay && (
            <Badge className="bg-gradient-to-r from-indigo-500/40 to-pink-500/40 text-white flex items-center gap-1">
              {getTimeIcon(timeOfDay)}
              {timeOfDay}
            </Badge>
          )}
          
          {activity && (
            <Badge className="bg-gradient-to-r from-green-500/40 to-emerald-500/40 text-white flex items-center gap-1">
              {getActivityIcon(activity)}
              {activity}
            </Badge>
          )}
        </div>
        
        {outfit.description && (
          <p className="text-gray-200 text-sm mb-3">{outfit.description}</p>
        )}
        
        {weather && (
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <ThermometerSun className="h-4 w-4 text-yellow-300" />
            <span>
              Selected for {weather.temperature}°C {weather.condition} weather
              {weather.feelsLike && weather.feelsLike !== weather.temperature && ` (feels like ${weather.feelsLike}°C)`}
            </span>
          </div>
        )}
        
        <div className="flex flex-wrap md:flex-nowrap gap-2 justify-between mt-4">
          <Button 
            onClick={onLike} 
            variant="outline" 
            size="sm" 
            className="flex-1 md:flex-none bg-white/5 border-white/10 hover:bg-white/10 text-white"
          >
            <ThumbsUp className="h-4 w-4 mr-1 text-green-400" />
            Like
          </Button>
          
          <Button 
            onClick={onDislike} 
            variant="outline" 
            size="sm" 
            className="flex-1 md:flex-none bg-white/5 border-white/10 hover:bg-white/10 text-white"
          >
            <ThumbsDown className="h-4 w-4 mr-1 text-red-400" />
            Dislike
          </Button>
          
          <Button 
            onClick={onToggleFavorite} 
            variant="outline"
            size="sm" 
            className={cn(
              "flex-1 md:flex-none bg-white/5 border-white/10 hover:bg-white/10 text-white",
              outfit.favorite && "bg-pink-600/30 border-pink-400"
            )}
          >
            <Heart className={cn(
              "h-4 w-4 mr-1",
              outfit.favorite ? "text-pink-400 fill-pink-400" : "text-pink-300"
            )} />
            {outfit.favorite ? "Favorited" : "Favorite"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OutfitSuggestion;
