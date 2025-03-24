import { ClothingItem, Outfit, WeatherInfo, PersonalityTag, ClothingOccasion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, ThumbsUp, ThumbsDown, Sun, Cloud, CloudRain, Camera, Tag, Party, Briefcase, Shirt, ShoppingBag, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface OutfitSuggestionProps {
  outfit: Outfit;
  items: ClothingItem[];
  weather?: WeatherInfo;
  onWear: (outfitId: string) => void;
  onRefresh: () => void;
  onLike: () => void;
  onDislike: () => void;
}

const getOccasionIcon = (occasion: string) => {
  switch (occasion) {
    case 'casual':
    case 'everyday':
      return <Shirt className="h-3 w-3" />;
    case 'formal':
    case 'business':
    case 'work':
    case 'meeting':
    case 'interview':
    case 'presentation':
      return <Briefcase className="h-3 w-3" />;
    case 'party':
    case 'special':
    case 'date':
    case 'evening':
    case 'restaurant':
      return <Party className="h-3 w-3" />;
    case 'sporty':
    case 'outdoor':
    case 'vacation':
    case 'shopping':
    case 'brunch':
    case 'weekend':
    case 'city walk':
    case 'hangout':
      return <ShoppingBag className="h-3 w-3" />;
    case 'concert':
      return <Star className="h-3 w-3" />;
    default:
      return <Tag className="h-3 w-3" />;
  }
};

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
  
  const getColorMatchScore = () => {
    if (outfitItems.length < 2) return null;
    
    const colors = outfitItems.map(item => item.color);
    const uniqueColors = [...new Set(colors)];
    
    const complementaryPairs = [
      ['black', 'white'], ['blue', 'orange'], ['red', 'green'], ['yellow', 'purple']
    ];
    
    if (uniqueColors.length === 1 || 
       (uniqueColors.length === 2 && (uniqueColors.includes('black') || uniqueColors.includes('white') || uniqueColors.includes('gray')))) {
      return { score: 'excellent', message: 'Monochromatic palette' };
    }
    
    for (const pair of complementaryPairs) {
      if (colors.includes(pair[0] as any) && colors.includes(pair[1] as any)) {
        return { score: 'good', message: 'Complementary colors' };
      }
    }
    
    const neutralColors = ['black', 'white', 'gray', 'brown'];
    const accentColors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange'];
    
    const hasNeutrals = colors.some(color => neutralColors.includes(color as string));
    const hasOneAccent = accentColors.filter(accent => colors.includes(accent as any)).length === 1;
    
    if (hasNeutrals && hasOneAccent) {
      return { score: 'good', message: 'Neutral with accent' };
    }
    
    if (uniqueColors.length > 3) {
      return { score: 'fair', message: 'Multiple colors' };
    }
    
    return { score: 'good', message: 'Balanced colors' };
  };
  
  const colorMatch = getColorMatchScore();
  
  const getWeatherIcon = () => {
    if (!weather) return <Sun className="h-5 w-5" />;
    
    const condition = weather.condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) return <Sun className="h-5 w-5" />;
    if (condition.includes('cloud')) return <Cloud className="h-5 w-5" />;
    if (condition.includes('rain')) return <CloudRain className="h-5 w-5" />;
    
    return <Sun className="h-5 w-5" />;
  };

  const getTagColor = (tag: PersonalityTag) => {
    switch(tag) {
      case 'minimalist': return 'bg-gray-500/70 hover:bg-gray-500/90';
      case 'bold': return 'bg-red-500/70 hover:bg-red-500/90';
      case 'trendy': return 'bg-purple-500/70 hover:bg-purple-500/90';
      case 'classic': return 'bg-blue-500/70 hover:bg-blue-500/90';
      case 'casual': return 'bg-green-500/70 hover:bg-green-500/90';
      case 'formal': return 'bg-slate-700/70 hover:bg-slate-700/90';
      case 'sporty': return 'bg-orange-500/70 hover:bg-orange-500/90';
      case 'elegant': return 'bg-indigo-500/70 hover:bg-indigo-500/90';
      case 'vintage': return 'bg-amber-500/70 hover:bg-amber-500/90';
      case 'bohemian': return 'bg-teal-500/70 hover:bg-teal-500/90';
      case 'preppy': return 'bg-emerald-500/70 hover:bg-emerald-500/90';
      case 'artistic': return 'bg-fuchsia-500/70 hover:bg-fuchsia-500/90';
      default: return 'bg-gray-500/70 hover:bg-gray-500/90';
    }
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
            <div className="flex items-center space-x-2 bg-black/40 rounded-full py-1.5 px-3 backdrop-blur-sm border border-white/10">
              {getWeatherIcon()}
              <span className="text-white font-medium">{weather.temperature}°C</span>
              {weather.city && (
                <span className="text-white/90 text-sm hidden sm:inline-block">• {weather.city}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-5">
          {outfit.personalityTags && outfit.personalityTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {outfit.personalityTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline"
                  className={cn("text-xs py-0.5 px-2 backdrop-blur-sm border-white/10", getTagColor(tag))}
                >
                  <Tag className="h-3 w-3 mr-1 opacity-70" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {colorMatch && (
            <div className="mb-3">
              <p className="text-sm text-white/80 flex items-center mb-1">
                <span className="mr-2">Color harmony:</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  colorMatch.score === 'excellent' ? "bg-green-500/50" : 
                  colorMatch.score === 'good' ? "bg-blue-500/50" : 
                  "bg-amber-500/50"
                )}>
                  {colorMatch.message}
                </span>
              </p>
            </div>
          )}
          
          {outfit.occasions && outfit.occasions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="text-xs text-white/70">Perfect for:</span>
              {outfit.occasions.map(occasion => (
                <span key={occasion} className="text-xs py-0.5 px-2 bg-purple-800/30 rounded-full capitalize flex items-center gap-1">
                  {getOccasionIcon(occasion)}
                  {occasion}
                </span>
              ))}
            </div>
          )}
          
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
                  {item.favorite && (
                    <div className="absolute top-2 right-2 bg-red-500/80 w-5 h-5 flex items-center justify-center rounded-full">
                      <ThumbsUp className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {outfit.lastWorn && (
            <div className="text-xs text-white/70 mt-1">
              Last worn: {new Date(outfit.lastWorn).toLocaleDateString()}
              {outfit.timesWorn > 0 && ` • Worn ${outfit.timesWorn} ${outfit.timesWorn === 1 ? 'time' : 'times'}`}
            </div>
          )}

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
