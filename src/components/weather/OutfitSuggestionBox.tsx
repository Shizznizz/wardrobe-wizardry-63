
import { WeatherInfo } from '@/lib/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface OutfitSuggestionBoxProps {
  weather: WeatherInfo;
}

const OutfitSuggestionBox = ({ weather }: OutfitSuggestionBoxProps) => {
  // Weather-based outfit suggestions
  const getOutfitSuggestion = () => {
    const temp = weather.temperature;
    const condition = weather.condition.toLowerCase();
    
    if (temp < 10) {
      return "It's chilly today - wear a warm coat, scarf, and boots!";
    } else if (temp < 18) {
      return "It's cool outside - try a light jacket and some comfortable jeans.";
    } else if (temp < 25) {
      return "Perfect weather for a light sweater or a long-sleeve shirt.";
    } else {
      return "It's warm today - opt for breathable fabrics and light colors!";
    }
    
    // Could add more specific suggestions based on condition (rainy, etc.)
  };
  
  return (
    <motion.div 
      className="mt-2 bg-white/10 rounded-lg p-3 border border-white/10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-sm text-white/90 italic mb-2">
        "{getOutfitSuggestion()}"
      </p>
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-white/80 hover:text-white hover:bg-white/10 p-1 h-auto"
        >
          See items →
        </Button>
      </div>
    </motion.div>
  );
};

export default OutfitSuggestionBox;
