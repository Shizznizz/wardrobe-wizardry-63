
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Thermometer, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Outfit } from '@/lib/types';

interface OutfitExplanationSectionProps {
  currentOutfit: Outfit | undefined;
  onRefresh: () => void;
  temperature: number;
  weather: {
    temperature: number;
    condition: string;
  };
}

const OutfitExplanationSection = ({ 
  currentOutfit, 
  onRefresh,
  temperature,
  weather
}: OutfitExplanationSectionProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  if (!currentOutfit) {
    return (
      <div className="text-center py-10">
        <p className="text-white/70">No outfit selected</p>
      </div>
    );
  }
  
  // Generate some sample explanations
  const explanations = [
    "The neutral color palette works with your skin tone",
    "The layering adapts to changing temperatures",
    "These pieces are versatile for different occasions"
  ];
  
  // Generate style tags based on outfit and season
  const styleTags = ['Casual', 'Balanced', 'Versatile'];
  if (currentOutfit.seasons.includes('summer')) {
    styleTags.push('Breathable');
  } else if (currentOutfit.seasons.includes('winter')) {
    styleTags.push('Warm');
  }
  
  if (currentOutfit.occasions?.includes('formal')) {
    styleTags.push('Elegant');
  } else if (currentOutfit.occasions?.includes('casual')) {
    styleTags.push('Relaxed');
  }
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };
  
  const handleMakeWarmer = () => {
    toast.success("Making your outfit warmer...");
    setTimeout(() => {
      onRefresh();
    }, 500);
  };
  
  const handleChangeTop = () => {
    toast.success("Finding alternative top options...");
    setTimeout(() => {
      onRefresh();
    }, 500);
  };
  
  return (
    <Card className="overflow-hidden border-white/10 bg-slate-900/60 shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Why This Works</h2>
          
          <div className="flex flex-wrap gap-2">
            {styleTags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="bg-white/5 border-purple-400/30 text-white"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-white/70 mb-3">Olivia's explanation:</h3>
          <ul className="space-y-2">
            {explanations.map((explanation, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-white/90"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
                <span>{explanation}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        
        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="border-sky-400/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Try Again
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-amber-400/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
              onClick={handleMakeWarmer}
            >
              <Thermometer className="mr-2 h-4 w-4" />
              {temperature < 15 ? "Make Warmer" : "Make Cooler"}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-blue-400/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
              onClick={handleChangeTop}
            >
              <Shirt className="mr-2 h-4 w-4" />
              Change Top
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutfitExplanationSection;
