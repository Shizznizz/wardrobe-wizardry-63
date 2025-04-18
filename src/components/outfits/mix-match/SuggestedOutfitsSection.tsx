
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightCircle, ArrowLeft, ArrowRight, Calendar, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Outfit, ClothingItem } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

interface SuggestedOutfitsSectionProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  weather: {
    temperature: number;
    condition: string;
  };
}

const SuggestedOutfitsSection = ({ outfits, clothingItems, weather }: SuggestedOutfitsSectionProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const pageSize = 3;
  
  const totalPages = Math.ceil(outfits.length / pageSize);
  const currentOutfits = outfits.slice(currentIndex * pageSize, (currentIndex + 1) * pageSize);
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };
  
  const handleTryOn = (outfit: Outfit) => {
    toast.success(`Opening ${outfit.name} in fitting room`);
    navigate('/fitting-room');
  };
  
  const getOutfitItemImage = (outfit: Outfit): string => {
    if (!outfit.items || outfit.items.length === 0) return '/placeholder.svg';
    
    const firstItemId = outfit.items[0];
    const item = clothingItems.find(item => item.id === firstItemId);
    
    return item?.imageUrl || '/placeholder.svg';
  };
  
  const getWeatherSuitableText = (outfit: Outfit) => {
    if (!outfit.seasons) return null;
    
    const isWarm = weather.temperature > 20;
    const isCold = weather.temperature < 10;
    const isRainy = weather.condition.toLowerCase().includes('rain');
    const isSnowy = weather.condition.toLowerCase().includes('snow');
    
    if (isRainy && outfit.seasons.includes('autumn')) {
      return 'Perfect for rainy weather';
    } else if (isSnowy && outfit.seasons.includes('winter')) {
      return 'Ideal for snow days';
    } else if (isCold && (outfit.seasons.includes('winter') || outfit.seasons.includes('autumn'))) {
      return 'Great for colder days';
    } else if (isWarm && (outfit.seasons.includes('summer') || outfit.seasons.includes('spring'))) {
      return 'Perfect for warm weather';
    }
    
    return 'Matches your style';
  };
  
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
          Suggested For You
        </h2>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={outfits.length <= pageSize}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={outfits.length <= pageSize}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentOutfits.map((outfit, index) => (
          <motion.div
            key={outfit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/60 border-white/10 overflow-hidden">
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={getOutfitItemImage(outfit)} 
                  alt={outfit.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-medium text-lg">{outfit.name}</h3>
                  
                  <div className="flex flex-wrap gap-1 mt-1 mb-3">
                    {outfit.seasons && outfit.seasons.slice(0, 2).map((season, index) => (
                      <Badge key={index} variant="outline" className="border-white/20 text-white/90">
                        {season}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-white/80 text-sm mb-4">{getWeatherSuitableText(outfit)}</p>
                  
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => handleTryOn(outfit)}
                  >
                    <ArrowRightCircle className="mr-2 h-4 w-4" /> Try on Olivia
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-3">
                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    onClick={() => {
                      toast.success(`Added ${outfit.name} to your calendar`);
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" /> Add to Calendar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    onClick={() => {
                      toast.success('Taking you to shop similar items!');
                      navigate('/shop-and-try');
                    }}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" /> Shop Similar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedOutfitsSection;
