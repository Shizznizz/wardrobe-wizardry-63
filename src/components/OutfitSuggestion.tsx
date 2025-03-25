
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, MessageCircle, Thermometer, RefreshCw, ThumbsUp, ThumbsDown, ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClothingItem, Outfit, WeatherInfo, TimeOfDay, Activity } from '@/lib/types';

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
      ).filter(Boolean);
      
      // Group items by category (assuming first is top, second is bottom, etc.)
      const topItem = outfitItems[0];
      const bottomItem = outfitItems[1];
      const accessoryItems = outfitItems.slice(2);
      
      return (
        <div className="space-y-5">
          <h3 className="text-xl font-semibold mb-1">{outfit.name}</h3>
          
          {/* Visual Flow Container */}
          <div className="relative">
            {/* Top Item with animation */}
            {topItem && (
              <motion.div 
                className="mb-6 relative"
                initial="hidden"
                animate="visible"
                custom={0}
                variants={itemVariants}
              >
                <div className="relative rounded-lg overflow-hidden border border-white/20 shadow-md group">
                  <img 
                    src={topItem.imageUrl} 
                    alt={topItem.name} 
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-sm text-white truncate">
                    {topItem.name}
                  </div>
                  
                  {/* Change top button */}
                  {onChangeTop && (
                    <div className="absolute top-2 right-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={onChangeTop}
                        className="bg-black/40 backdrop-blur-sm border-white/20 text-white text-xs p-1.5 h-auto"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Change
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Downward arrow */}
                <motion.div 
                  className="flex justify-center my-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <ArrowDown className="h-5 w-5 text-purple-400 animate-bounce" />
                </motion.div>
              </motion.div>
            )}
            
            {/* Bottom Item with animation */}
            {bottomItem && (
              <motion.div 
                className="mb-6 relative"
                initial="hidden"
                animate="visible"
                custom={1}
                variants={itemVariants}
              >
                <div className="relative rounded-lg overflow-hidden border border-white/20 shadow-md group">
                  <img 
                    src={bottomItem.imageUrl} 
                    alt={bottomItem.name} 
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-sm text-white truncate">
                    {bottomItem.name}
                  </div>
                  
                  {/* Change bottom button */}
                  {onChangeBottom && (
                    <div className="absolute top-2 right-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={onChangeBottom}
                        className="bg-black/40 backdrop-blur-sm border-white/20 text-white text-xs p-1.5 h-auto"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Change
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Accessories indicator with downward arrow if there are accessory items */}
                {accessoryItems.length > 0 && (
                  <motion.div 
                    className="flex justify-center my-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <ArrowDown className="h-5 w-5 text-purple-400 animate-bounce" />
                  </motion.div>
                )}
              </motion.div>
            )}
            
            {/* Accessories Grid */}
            {accessoryItems.length > 0 && (
              <motion.div 
                className="grid grid-cols-2 gap-3 mb-6"
                initial="hidden"
                animate="visible"
                custom={2}
                variants={itemVariants}
              >
                {accessoryItems.map((item, index) => item && (
                  <div key={index} className="relative rounded-lg overflow-hidden border border-white/20 shadow-md group">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-sm text-white truncate">
                      {item.name}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
          
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
            
            {/* Outfit Adjustment Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {onMakeWarmer && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onMakeWarmer}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 border border-white/10"
                >
                  <Thermometer className="h-4 w-4" />
                  <span>Make It Warmer</span>
                </Button>
              )}
              
              {onWear && (
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
                  onClick={() => onWear(outfit.id)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Wear This Outfit
                </Button>
              )}
            </div>
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
