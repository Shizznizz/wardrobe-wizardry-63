
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClothingItem, Outfit, WeatherInfo } from '@/lib/types';

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
  onReset?: () => void;
  onWear?: (outfitId: string) => void;
  onRefresh?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
}

const OutfitSuggestion = ({ 
  suggestion, 
  outfit, 
  items, 
  weather, 
  onReset, 
  onWear, 
  onRefresh, 
  onLike, 
  onDislike 
}: OutfitSuggestionProps) => {
  
  // Generate a friendly explanation based on weather and outfit
  const generateOliviaReasoning = () => {
    if (!weather) return "";
    
    const temp = weather.temperature;
    const condition = weather.condition.toLowerCase();
    const location = weather.city ? `in ${weather.city}` : '';
    
    // Different reasonings based on temperature and weather conditions
    if (temp < 10) {
      if (condition.includes('rain')) {
        return `It's quite cold and rainy ${location} today, so I've selected warm layers that will keep you dry and stylish!`;
      }
      return `Since it's pretty chilly ${location} right now, I've chosen cozy pieces that will keep you warm while looking put together.`;
    }
    
    if (temp < 18) {
      if (condition.includes('cloud')) {
        return `With the cloudy weather and mild temperatures ${location}, I thought these layers would be perfect for your day!`;
      }
      return `The cool but pleasant temperature ${location} calls for light layers that can be adjusted throughout your day.`;
    }
    
    if (temp < 25) {
      if (condition.includes('rain')) {
        return `It's mild with some rain ${location}, so I've picked comfortable pieces with a light water-resistant layer.`;
      }
      return `The lovely spring-like weather ${location} is perfect for this balanced outfit that's neither too warm nor too cool!`;
    }
    
    if (condition.includes('rain')) {
      return `It's warm with a chance of rain ${location}, so I chose breathable fabrics with a light layer for those surprise showers!`;
    }
    return `With the warm weather ${location}, I've selected breathable, light fabrics that will keep you comfortable and stylish all day.`;
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
      
      // Generate Olivia's reasoning based on weather conditions
      const oliviaReasoning = generateOliviaReasoning();
      
      return (
        <>
          {oliviaReasoning && (
            <div className="mb-4 bg-purple-900/20 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30">
              <div className="flex items-start gap-2">
                <MessageCircle className="h-5 w-5 text-purple-300 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-purple-200 mb-1">Olivia's Reasoning:</h4>
                  <p className="text-sm text-white/90 italic">"{oliviaReasoning}"</p>
                </div>
              </div>
            </div>
          )}
          
          <h3 className="text-lg font-semibold mb-2">{outfit.name}</h3>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {outfitItems.map((item, index) => item && (
              <div key={index} className="relative rounded overflow-hidden border border-gray-200">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-xs text-white truncate">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {outfit.seasons.map(season => (
              <span key={season} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {season}
              </span>
            ))}
            {outfit.occasions.map(occasion => (
              <span key={occasion} className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                {occasion}
              </span>
            ))}
          </div>
          
          {weather && (
            <div className="text-sm text-gray-600 mb-3">
              <span className="font-medium">Weather: </span>
              {weather.temperature}°C, {weather.condition}
            </div>
          )}
          
          <div className="flex gap-2 mt-2">
            {onWear && (
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => onWear(outfit.id)}
              >
                Wear It
              </Button>
            )}
            
            {onRefresh && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onRefresh}
              >
                Refresh
              </Button>
            )}
            
            {onLike && onDislike && (
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={onLike} className="text-green-500">
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={onDislike} className="text-red-500">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </>
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
      className="text-center"
    >
      {renderContent()}
    </motion.div>
  );
};

export default OutfitSuggestion;
