
import { ClothingItem, Outfit, WeatherInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, ThumbsUp, ThumbsDown, Sun, Cloud, CloudRain, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OutfitSuggestionProps {
  outfit: Outfit;
  items: ClothingItem[];
  weather?: WeatherInfo;
  onWear: (outfitId: string) => void;
  onRefresh: () => void;
  onLike: () => void;
  onDislike: () => void;
}

const OutfitSuggestion = ({
  outfit,
  items,
  weather,
  onWear,
  onRefresh,
  onLike,
  onDislike
}: OutfitSuggestionProps) => {
  const outfitItems = items.filter(item => outfit.items.includes(item.id));
  
  const getWeatherIcon = () => {
    if (!weather) return <Sun className="h-5 w-5" />;
    
    const condition = weather.condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) return <Sun className="h-5 w-5" />;
    if (condition.includes('cloud')) return <Cloud className="h-5 w-5" />;
    if (condition.includes('rain')) return <CloudRain className="h-5 w-5" />;
    
    return <Sun className="h-5 w-5" />;
  };

  const handleWear = () => {
    onWear(outfit.id);
    toast.success("Great choice! Your outfit has been logged.", {
      description: "This helps us learn your preferences."
    });
  };

  return (
    <div className="glass-dark rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-white">{outfit.name}</h3>
          {weather && (
            <div className="flex items-center space-x-2 text-sm text-white/70">
              {getWeatherIcon()}
              <span>{weather.temperature}°C</span>
            </div>
          )}
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {outfitItems.map((item) => (
              <div key={item.id} className="relative rounded-lg overflow-hidden border border-white/10 bg-black/20">
                <div className="aspect-square">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2">
                  <p className="text-sm font-medium truncate text-white">{item.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-between items-center pt-2">
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                className="h-10 w-10 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                onClick={onLike}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                className="h-10 w-10 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                onClick={onDislike}
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </Button>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm"
                    className="flex items-center space-x-1 group h-10 px-4 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
                    onClick={handleWear}
                  >
                    <span>Wear Today</span>
                    <Check className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 border-white/10 text-white">
                  <p>Log this outfit as worn today</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitSuggestion;
