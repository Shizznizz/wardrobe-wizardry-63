
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, MessageCircle, Thermometer, RefreshCw, ThumbsUp, ThumbsDown, ArrowDown, ArrowUp, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClothingItem, Outfit, WeatherInfo, TimeOfDay, Activity } from '@/lib/types';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface OutfitSuggestionProps {
  suggestion?: {
    title: string;
    description: string;
    image: string;
    items: string[];
  };
  outfit?: Outfit;
  items?: ClothingItem[];
  weather?: WeatherInfo;
  timeOfDay?: TimeOfDay;
  activity?: Activity;
  onReset?: () => void;
  onWear?: (outfitId: string) => void;
  onRefresh?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onMakeWarmer?: () => void;
  onChangeTop?: () => void;
  onChangeBottom?: () => void;
  onToggleFavorite?: () => void;
}

const OutfitSuggestion = ({ 
  suggestion, 
  outfit, 
  items, 
  weather, 
  timeOfDay,
  activity,
  onReset, 
  onWear, 
  onRefresh, 
  onLike, 
  onDislike,
  onMakeWarmer,
  onChangeTop,
  onChangeBottom
}: OutfitSuggestionProps) => {
  
  // Framer Motion variants for animations
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.6,
        duration: 0.3
      }
    }
  };
  
  // Generate dynamic heading based on weather and location
  const getDynamicHeading = () => {
    if (!weather) return "Olivia's Outfit Pick for You";
    
    // Create personalized heading based on available information
    const locationText = weather.city ? `for ${weather.city}` : '';
    const weatherText = weather.temperature !== undefined ? ` (${weather.temperature}°C)` : '';
    
    if (activity && weather.city) {
      return `Your Perfect ${activity} Outfit ${locationText}${weatherText}`;
    } else if (weather.city) {
      return `Olivia's Pick ${locationText} Today${weatherText}`;
    } else if (weather.temperature !== undefined) {
      return `Your Perfect Outfit for ${weather.temperature}°C ${weather.condition}`;
    }
    
    return "Olivia's Personalized Outfit Pick";
  };
  
  // Determine what to render based on provided props
  const renderContent = () => {
    // If we have a suggestion object (used in the quiz)
    if (suggestion) {
      return (
        <>
          <div className="mb-3 flex justify-center">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
              <Check className="h-4 w-4 mr-1" /> Perfect Match Found!
            </div>
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
            {suggestion.title}
          </h3>
          
          <div className="relative rounded-lg overflow-hidden mb-4 max-w-sm mx-auto mt-4">
            <img 
              src={suggestion.image} 
              alt={suggestion.title} 
              className="w-full object-cover shadow-lg h-64"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-transparent to-transparent flex items-end">
              <div className="p-4 w-full">
                <div className="text-xs uppercase tracking-wider text-purple-200 mb-1 font-semibold">Olivia says...</div>
                <p className="text-white italic text-sm">
                  "{suggestion.description}"
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-purple-200 mb-2 flex items-center justify-center">
              <Sparkles className="h-4 w-4 mr-1 text-purple-300" /> Key Pieces
            </h4>
            <ul className="space-y-2">
              {suggestion.items.map((item, index) => (
                <li 
                  key={index}
                  className="text-sm text-white/80 flex items-center gap-2"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-pink-400"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex gap-4 justify-center">
            {onReset && (
              <Button
                onClick={onReset}
                variant="outline"
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                Try Again
              </Button>
            )}
            
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <span>Explore More</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      );
    }
    
    // If we have an outfit object (used in wardrobe and outfits pages)
    if (outfit && items) {
      // Find the actual items from the outfit.items array (which contains ids)
      const outfitItems = outfit.items.map(itemId => 
        items.find(item => item.id === itemId)
      ).filter(Boolean) as ClothingItem[];
      
      // Group items by category (assuming first is top, second is bottom, etc.)
      const topItem = outfitItems[0];
      const bottomItem = outfitItems[1];
      const accessoryItems = outfitItems.slice(2);
      
      return (
        <div className="space-y-5">
          {/* Dynamic Heading */}
          <motion.h3 
            className="text-2xl font-semibold mb-3 text-white/90 flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {weather?.city && <MapPin className="h-5 w-5 text-purple-400" />}
            {getDynamicHeading()}
          </motion.h3>

          {/* Items displayed side by side with equal sizing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 overflow-x-auto pb-2">
            {/* Top Item */}
            {topItem && (
              <motion.div 
                className="relative"
                initial="hidden"
                animate="visible"
                custom={0}
                variants={itemVariants}
              >
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="relative bg-white/5 rounded-lg overflow-hidden border border-white/20 shadow-md group cursor-pointer h-full">
                      <div className="aspect-square w-full">
                        <AspectRatio ratio={1 / 1}>
                          <motion.img 
                            src={topItem.imageUrl} 
                            alt={topItem.name} 
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                            whileHover={{ scale: 1.05 }}
                          />
                        </AspectRatio>
                      </div>
                      <div className="p-3">
                        <h4 className="text-white font-medium truncate">{topItem.name}</h4>
                        <p className="text-white/70 text-sm">{topItem.type} • {topItem.color}</p>
                      </div>
                      
                      {/* Change top button */}
                      {onChangeTop && (
                        <div className="absolute top-2 right-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onChangeTop();
                            }}
                            className="bg-black/40 backdrop-blur-sm border-white/20 text-white text-xs p-1.5 h-auto"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Change
                          </Button>
                        </div>
                      )}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-slate-800 border-slate-700 text-white">
                    <div className="space-y-2">
                      <h4 className="font-medium">{topItem.name}</h4>
                      <p className="text-sm text-slate-300">{topItem.type} • {topItem.color}</p>
                      <div className="rounded overflow-hidden">
                        <img 
                          src={topItem.imageUrl} 
                          alt={topItem.name} 
                          className="w-full rounded-md object-cover aspect-square"
                        />
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </motion.div>
            )}
            
            {/* Bottom Item */}
            {bottomItem && (
              <motion.div 
                className="relative"
                initial="hidden"
                animate="visible"
                custom={1}
                variants={itemVariants}
              >
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="relative bg-white/5 rounded-lg overflow-hidden border border-white/20 shadow-md group cursor-pointer h-full">
                      <div className="aspect-square w-full">
                        <AspectRatio ratio={1 / 1}>
                          <motion.img 
                            src={bottomItem.imageUrl} 
                            alt={bottomItem.name} 
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                            whileHover={{ scale: 1.05 }}
                          />
                        </AspectRatio>
                      </div>
                      <div className="p-3">
                        <h4 className="text-white font-medium truncate">{bottomItem.name}</h4>
                        <p className="text-white/70 text-sm">{bottomItem.type} • {bottomItem.color}</p>
                      </div>
                      
                      {/* Change bottom button */}
                      {onChangeBottom && (
                        <div className="absolute top-2 right-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onChangeBottom();
                            }}
                            className="bg-black/40 backdrop-blur-sm border-white/20 text-white text-xs p-1.5 h-auto"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Change
                          </Button>
                        </div>
                      )}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-slate-800 border-slate-700 text-white">
                    <div className="space-y-2">
                      <h4 className="font-medium">{bottomItem.name}</h4>
                      <p className="text-sm text-slate-300">{bottomItem.type} • {bottomItem.color}</p>
                      <div className="rounded overflow-hidden">
                        <img 
                          src={bottomItem.imageUrl} 
                          alt={bottomItem.name} 
                          className="w-full rounded-md object-cover aspect-square"
                        />
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </motion.div>
            )}
            
            {/* Accessories - if no accessories, show placeholder for grid alignment */}
            {accessoryItems.length > 0 ? (
              <motion.div 
                className="relative"
                initial="hidden"
                animate="visible"
                custom={2}
                variants={itemVariants}
              >
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="relative bg-white/5 rounded-lg overflow-hidden border border-white/20 shadow-md group cursor-pointer h-full">
                      <div className="aspect-square w-full">
                        <AspectRatio ratio={1 / 1}>
                          <motion.img 
                            src={accessoryItems[0]?.imageUrl} 
                            alt={accessoryItems[0]?.name} 
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                            whileHover={{ scale: 1.05 }}
                          />
                        </AspectRatio>
                      </div>
                      <div className="p-3">
                        <h4 className="text-white font-medium truncate">{accessoryItems[0]?.name}</h4>
                        <p className="text-white/70 text-sm">{accessoryItems[0]?.type} • {accessoryItems[0]?.color}</p>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-slate-800 border-slate-700 text-white">
                    <div className="space-y-2">
                      <h4 className="font-medium">{accessoryItems[0]?.name}</h4>
                      <p className="text-sm text-slate-300">{accessoryItems[0]?.type} • {accessoryItems[0]?.color}</p>
                      <div className="rounded overflow-hidden">
                        <img 
                          src={accessoryItems[0]?.imageUrl} 
                          alt={accessoryItems[0]?.name} 
                          className="w-full rounded-md object-cover aspect-square"
                        />
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </motion.div>
            ) : (
              <div className="hidden sm:block" /> {/* Empty placeholder for grid alignment on desktop */}
            )}
          </div>
          
          {/* Multiple accessories (if more than one) */}
          {accessoryItems.length > 1 && (
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {accessoryItems.slice(1).map((item, index) => (
                <div key={index} className="relative bg-white/5 rounded-lg overflow-hidden border border-white/20 shadow-sm">
                  <AspectRatio ratio={1 / 1}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                    <p className="text-white text-xs truncate">{item.name}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
          
          {/* Tags */}
          <motion.div 
            className="flex flex-wrap gap-1.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {outfit.seasons.map(season => (
              <span key={season} className="text-xs px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-100 border border-blue-800/30">
                {season}
              </span>
            ))}
            {outfit.occasions.map(occasion => (
              <span key={occasion} className="text-xs px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-100 border border-purple-800/30">
                {occasion}
              </span>
            ))}
          </motion.div>
          
          {/* Interaction Buttons with visual indicator */}
          <motion.div 
            className="relative mt-6 pt-4"
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
          >
            {/* Up arrow indicator for interaction */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <ArrowUp className="h-5 w-5 text-purple-400 animate-bounce" />
            </div>
            
            {/* Like/Dislike Buttons */}
            {onLike && onDislike && (
              <div className="flex justify-center gap-4 pt-1 mb-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={onLike} 
                  className="flex-1 bg-white/5 border-white/20 text-white/90 hover:bg-white/10 hover:text-white group"
                >
                  <ThumbsUp className="h-4 w-4 mr-2 group-hover:text-green-400" />
                  Like This
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={onDislike} 
                  className="flex-1 bg-white/5 border-white/20 text-white/90 hover:bg-white/10 hover:text-white group"
                >
                  <ThumbsDown className="h-4 w-4 mr-2 group-hover:text-red-400" />
                  Not For Me
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      );
    }
    
    // Fallback if no recognized props pattern
    return (
      <div className="p-4 text-center">
        <p>No outfit data available</p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {renderContent()}
    </motion.div>
  );
};

export default OutfitSuggestion;
