
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Outfit, ClothingItem, WeatherInfo } from '@/lib/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SuggestedOutfitsSectionProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  weather?: WeatherInfo;
}

const SuggestedOutfitsSection = ({ outfits, clothingItems, weather }: SuggestedOutfitsSectionProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  
  // Calculate the total number of pages
  const totalPages = Math.ceil(outfits.length / itemsPerPage);
  
  // Get the current page of outfits
  const currentOutfits = outfits.slice(
    currentIndex * itemsPerPage, 
    (currentIndex + 1) * itemsPerPage
  );
  
  const handlePrevPage = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : totalPages - 1));
  };
  
  const handleNextPage = () => {
    setCurrentIndex(prev => (prev < totalPages - 1 ? prev + 1 : 0));
  };
  
  const handleTryOnOlivia = (outfit: Outfit) => {
    navigate('/fitting-room', { state: { outfitId: outfit.id } });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">
            Suggested For You
          </h2>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-white/20 text-white hover:bg-white/10"
              onClick={handlePrevPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-white/70">
              {currentIndex + 1} / {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-white/20 text-white hover:bg-white/10"
              onClick={handleNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentOutfits.map((outfit, index) => {
          // Find a clothing item to use as the main image
          const mainItem = clothingItems.find(item => 
            outfit.items && outfit.items.includes(item.id)
          );
          
          return (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-white/10 hover:border-purple-500/30 transition-colors overflow-hidden h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
                  <img 
                    src={mainItem?.imageUrl || '/placeholder.svg'} 
                    alt={outfit.name}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute top-3 left-3 z-20">
                    <Badge 
                      variant="outline"
                      className="bg-purple-500/40 border-purple-400/30 text-white text-xs backdrop-blur-sm"
                    >
                      Olivia's Pick
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4 flex flex-col gap-3 flex-grow">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">
                      {outfit.name}
                    </h3>
                    
                    <p className="text-xs text-white/70">
                      {weather ? 
                        `Perfect for ${weather.temperature}°C ${weather.condition} weather.` :
                        `Based on your style preferences and recent choices.`
                      }
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {outfit.tags?.slice(0, 3).map((tag, idx) => (
                      <Badge 
                        key={idx}
                        variant="outline" 
                        className="bg-purple-500/20 border-purple-400/30 text-purple-200 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-3">
                    <Button
                      onClick={() => handleTryOnOlivia(outfit)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Try on Olivia
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedOutfitsSection;
