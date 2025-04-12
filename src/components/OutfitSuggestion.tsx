
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Check, ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Confetti } from '@/components/ui/confetti';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
  activity?: string;
  onReset?: () => void;
  onRefresh?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onMakeWarmer?: () => void;
  onChangeTop?: () => void;
  hideActions?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const OutfitSuggestion = ({ 
  suggestion, 
  outfit, 
  items, 
  weather, 
  activity,
  onReset,
  onRefresh,
  onLike,
  onDislike,
  onMakeWarmer,
  onChangeTop,
  hideActions = false,
  size = 'medium'
}: OutfitSuggestionProps) => {
  const navigate = useNavigate();
  
  const handleExploreMore = () => {
    if (suggestion) {
      // Store quiz results in session storage for potential use on the outfits page
      sessionStorage.setItem('quizStyleResult', JSON.stringify({
        title: suggestion.title,
        description: suggestion.description
      }));
      
      // Show toast and navigate to outfits page
      toast.success("Your style has been identified!", {
        description: "Let's find some perfect outfits for you."
      });
      
      // Navigate to the outfits page
      navigate("/outfits");
    }
  };
  
  // If we have an outfit prop but not a suggestion, create a suggestion-like object
  const displayData = suggestion || (outfit && {
    title: outfit.name,
    description: `Perfect for ${activity || 'any occasion'} in ${weather?.temperature ? `${weather.temperature}°C` : 'any'} weather.`,
    image: items?.find(item => outfit.items.includes(item.id))?.imageUrl || '/placeholder.svg',
    items: outfit.items.map(itemId => {
      const item = items?.find(i => i.id === itemId);
      return item?.name || 'Unknown item';
    })
  });
  
  // Safely return null if we don't have display data
  if (!displayData) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {onReset && <Confetti duration={2000} />}
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent rounded-xl z-10"></div>
            <motion.img 
              src={displayData.image} 
              alt={displayData.title}
              className={`w-full rounded-xl object-cover ${size === 'small' ? 'h-40 md:h-48' : 'h-64 md:h-80'}`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute bottom-4 left-4 z-20">
              <Badge variant="outline" className="bg-purple-500/30 border-purple-400/30 text-white backdrop-blur-sm px-3 py-1">
                <BadgeCheck className="mr-1 h-3.5 w-3.5 text-purple-200" />
                Perfect Match
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 space-y-4">
          <h3 className="text-xl font-bold text-white">{displayData.title}</h3>
          <p className="text-sm text-white/90">{displayData.description}</p>
          
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-medium text-white/80">Key Pieces:</h4>
            <ul className="space-y-2">
              {displayData.items.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  className="flex items-start gap-2"
                >
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/90">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Only show the buttons when we're in quiz mode */}
      {onReset && (
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-white/10 hover:bg-white/5 text-white/90"
          >
            Retake Quiz
          </Button>
          
          <Button
            size="sm"
            onClick={handleExploreMore}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <span>Explore More Outfits</span>
            <ArrowRightCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Show outfit feedback buttons when not in quiz mode */}
      {!hideActions && (onLike || onDislike || onMakeWarmer || onChangeTop) && (
        <div className="flex flex-wrap gap-2 justify-center">
          {onLike && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLike}
              className="border-green-500/30 hover:bg-green-500/10 text-green-300"
            >
              <span>I Like This</span>
            </Button>
          )}
          
          {onDislike && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDislike}
              className="border-red-500/30 hover:bg-red-500/10 text-red-300"
            >
              <span>Not For Me</span>
            </Button>
          )}
          
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="border-blue-500/30 hover:bg-blue-500/10 text-blue-300"
            >
              <span>Refresh</span>
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default OutfitSuggestion;
