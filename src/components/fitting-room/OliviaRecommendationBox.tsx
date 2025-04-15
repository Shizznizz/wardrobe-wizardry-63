import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, CloudRain, Sun, Snowflake, Wind, Shirt, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Outfit, WeatherInfo } from '@/lib/types';
import OliviaOutfitPick from './OliviaOutfitPick';

interface OliviaRecommendationBoxProps {
  weather: WeatherInfo;
  selectedOutfit: Outfit | null;
  onSuggestOutfit?: () => void;
  onFilterByTag?: (tag: string) => void;
  onTryOutfit?: (outfit: Outfit) => void;
  outfits: Outfit[];
}

const OliviaRecommendationBox = ({ 
  weather, 
  selectedOutfit,
  onSuggestOutfit,
  onFilterByTag,
  onTryOutfit,
  outfits = []
}: OliviaRecommendationBoxProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [suggestions, setsuggestions] = useState<string[]>([]);
  const [suggestedOutfit, setSuggestedOutfit] = useState<Outfit | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const weatherSuggestions = generateWeatherSuggestions(weather);
    setsuggestions(weatherSuggestions);
    setSuggestedOutfit(getSuggestedOutfit());
    
    setIsTyping(true);
    const randomIndex = Math.floor(Math.random() * weatherSuggestions.length);
    const message = weatherSuggestions[randomIndex];
    
    let index = 0;
    const interval = setInterval(() => {
      setCurrentMessage(message.substring(0, index));
      index++;
      
      if (index > message.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 25);
    
    return () => clearInterval(interval);
  }, [weather]);

  const getSuggestedOutfit = () => {
    if (!outfits || outfits.length === 0) return null;

    const weatherTemp = weather?.temperature || 20;
    const suitableOutfits = outfits.filter(outfit => {
      if (!outfit.seasons) return false;
      if (weatherTemp < 10) return outfit.seasons.includes('winter');
      if (weatherTemp < 20) return outfit.seasons.includes('spring') || outfit.seasons.includes('autumn');
      return outfit.seasons.includes('summer');
    });

    return suitableOutfits[Math.floor(Math.random() * suitableOutfits.length)] || outfits[0];
  };

  const handleTagClick = (tag: string) => {
    if (!onFilterByTag) return;

    if (tag === 'today') {
      const outfitsSection = document.getElementById('outfits-section');
      if (outfitsSection) {
        outfitsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    onFilterByTag(tag);
  };

  const handleRefreshSuggestion = async () => {
    if (!onSuggestOutfit) return;
    
    setIsRefreshing(true);
    await onSuggestOutfit();
    setSuggestedOutfit(getSuggestedOutfit());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getWeatherIcon = () => {
    const weatherType = weather?.icon || 'sun';
    const temp = weather?.temperature || 20;
    
    switch (weatherType.toLowerCase()) {
      case 'rain':
        return <CloudRain className="h-5 w-5 text-blue-400" />;
      case 'cloud':
        return <Wind className="h-5 w-5 text-gray-400" />;
      case 'snow':
        return <Snowflake className="h-5 w-5 text-blue-200" />;
      case 'sun':
      default:
        return <Sun className="h-5 w-5 text-yellow-400" />;
    }
  };
  
  const generateWeatherSuggestions = (weather: WeatherInfo) => {
    const weatherType = weather?.icon || 'sun';
    const temp = weather?.temperature || 20;
    const suggestions: string[] = [];
    
    if (temp < 10) {
      suggestions.push("It's quite chilly today! Let's pick a cozy outfit with layers to keep you warm.");
      suggestions.push("Perfect weather for a stylish sweater and your favorite boots!");
      suggestions.push("Time to bring out those warm layers - how about a statement coat today?");
    } else if (temp < 20) {
      suggestions.push("Mild temperatures call for versatile layering. Let me suggest a light jacket outfit.");
      suggestions.push("Great weather for that mid-weight jacket with a stylish scarf!");
      suggestions.push("Not too hot, not too cold - perfect for showcasing your transitional pieces!");
    } else {
      suggestions.push("It's warm today! Let's find something light and breezy for you.");
      suggestions.push("Perfect weather for that summer dress or light outfit you've been waiting to wear!");
      suggestions.push("How about we try some of your colorful summer pieces? The weather is perfect for them!");
    }
    
    if (weatherType.toLowerCase() === 'rain') {
      suggestions.push("Looks like rain today. Let's pick something that pairs well with your favorite boots and a waterproof layer.");
      suggestions.push("Rain is in the forecast! I can help you style an outfit that works with a chic raincoat.");
    }
    
    return suggestions;
  };

  return (
    <div className="space-y-4">
      <motion.div 
        className="glass-dark border border-white/10 rounded-xl p-4 shadow-xl shadow-purple-900/10 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-white">Olivia's Suggestions</h3>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-xs flex items-center gap-1 px-2 py-0.5"
                >
                  {getWeatherIcon()}
                  <span>{weather?.condition || 'Sunny'}, {weather?.temperature || '22'}°C</span>
                </Badge>
              </div>
            </div>
            
            <div className="min-h-[90px] bg-slate-900/50 rounded-lg p-3 border border-white/5 mb-3 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMessage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-white/90">
                    {currentMessage}
                    {isTyping && <span className="ml-1 animate-pulse">|</span>}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {!isTyping && (
                  <>
                    <Badge 
                      onClick={() => handleTagClick('today')}
                      className="bg-purple-500/20 text-purple-200 border-purple-500/30 text-xs cursor-pointer hover:bg-purple-500/30 transition-colors"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Today's Look
                    </Badge>
                    <Badge 
                      onClick={() => handleTagClick('weather')}
                      className="bg-blue-500/20 text-blue-200 border-blue-500/30 text-xs cursor-pointer hover:bg-blue-500/30 transition-colors"
                    >
                      {getWeatherIcon()}
                      Weather-Ready
                    </Badge>
                    <Badge 
                      onClick={() => handleTagClick('style')}
                      className="bg-pink-500/20 text-pink-200 border-pink-500/30 text-xs cursor-pointer hover:bg-pink-500/30 transition-colors"
                    >
                      <Shirt className="h-3 w-3 mr-1" />
                      Style Match
                    </Badge>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshSuggestion}
                disabled={isRefreshing}
                className={cn(
                  "text-xs text-white/80 hover:text-white border-white/10 hover:bg-white/5",
                  "bg-gradient-to-r from-slate-900/80 to-purple-900/20",
                  "transition-all duration-200 hover:scale-105"
                )}
              >
                {isRefreshing ? (
                  <span className="animate-spin">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Refresh Suggestion
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {suggestedOutfit && (
        <OliviaOutfitPick
          outfit={suggestedOutfit}
          onPreview={onTryOutfit || (() => {})}
          className="lg:mt-4"
        />
      )}
    </div>
  );
};

export default OliviaRecommendationBox;
