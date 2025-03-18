
import { ClothingItem, Outfit, WeatherInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCw, Check, ThumbsUp, ThumbsDown, Sun, Cloud, CloudRain, HelpCircle } from 'lucide-react';
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
    <div className="bg-white rounded-xl border shadow-soft overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium">{outfit.name}</h3>
          {weather && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {getWeatherIcon()}
              <span>{weather.temperature}°C</span>
            </div>
          )}
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {outfitItems.map((item) => (
              <div key={item.id} className="relative rounded-lg overflow-hidden border bg-white">
                <div className="aspect-square">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-2">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-between items-center pt-2">
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex items-center space-x-1 h-10"
                      onClick={onRefresh}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Refresh</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Get a new outfit suggestion</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                size="sm" 
                variant="outline"
                className="h-10 w-10 p-0"
                onClick={onLike}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                className="h-10 w-10 p-0"
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
                    className="flex items-center space-x-1 group h-10 px-4 text-sm"
                    onClick={handleWear}
                  >
                    <span>Wear Today</span>
                    <Check className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
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
