
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClothingItem } from '@/lib/types';
import { Sparkles, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface OliviaRecommendationSectionProps {
  weather: {
    temperature?: number;
    condition?: string;
  };
  situation: string;
  clothingItems: ClothingItem[];
  enableShuffle?: boolean;
}

const OliviaRecommendationSection = ({ 
  weather, 
  situation, 
  clothingItems,
  enableShuffle = false
}: OliviaRecommendationSectionProps) => {
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate a recommendation when the component mounts
  useEffect(() => {
    if (clothingItems.length > 0) {
      generateRecommendation();
    }
  }, [clothingItems, weather, situation]);
  
  // Function to generate recommendation based on weather and situation
  const generateRecommendation = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Simple algorithm to pick items that match the situation and weather
      const appropriateItems = clothingItems.filter(item => {
        // Check if the item is appropriate for the current temperature
        const isTemperatureAppropriate = checkTemperatureAppropriate(item, weather.temperature || 70);
        
        // Check if the item is appropriate for the current situation
        const isSituationAppropriate = item.occasions && 
          (item.occasions.includes(situation) || item.occasions.includes('all'));
        
        return isTemperatureAppropriate && isSituationAppropriate;
      });
      
      // Pick random items from the appropriate ones
      const tops = appropriateItems.filter(item => 
        ['shirt', 'blouse', 't-shirt', 'sweater', 'hoodie'].includes(item.type.toLowerCase())
      );
      
      const bottoms = appropriateItems.filter(item => 
        ['pants', 'jeans', 'skirt', 'shorts'].includes(item.type.toLowerCase())
      );
      
      const shoes = appropriateItems.filter(item => 
        ['shoes', 'sneakers', 'boots', 'sandals'].includes(item.type.toLowerCase())
      );
      
      const accessories = appropriateItems.filter(item => 
        ['accessory', 'hat', 'jewelry', 'bag', 'scarf', 'watch'].includes(item.type.toLowerCase())
      );
      
      // Pick one of each if available
      const selectedTop = tops.length > 0 ? tops[Math.floor(Math.random() * tops.length)] : null;
      const selectedBottom = bottoms.length > 0 ? bottoms[Math.floor(Math.random() * bottoms.length)] : null;
      const selectedShoes = shoes.length > 0 ? shoes[Math.floor(Math.random() * shoes.length)] : null;
      
      // Accessories are optional
      const selectedAccessory = accessories.length > 0 && Math.random() > 0.5 ? 
        accessories[Math.floor(Math.random() * accessories.length)] : null;
      
      const selectedOutfit = [selectedTop, selectedBottom, selectedShoes, selectedAccessory]
        .filter(Boolean) as ClothingItem[];
      
      setSelectedItems(selectedOutfit);
      setIsLoading(false);
    }, 1500); // Simulate delay
  };
  
  // Utility function to check if an item is appropriate for the current temperature
  const checkTemperatureAppropriate = (item: ClothingItem, temperature: number) => {
    const { season } = item;
    
    if (!season || season.includes('all')) return true;
    
    if (temperature > 75) {
      return season.includes('summer');
    } else if (temperature > 60) {
      return season.includes('spring') || season.includes('autumn');
    } else {
      return season.includes('winter');
    }
  };

  // Handle the shuffle button click
  const handleShuffleOutfit = () => {
    toast.info("Shuffling outfit...");
    generateRecommendation();
  };
  
  return (
    <motion.div 
      className="rounded-xl border border-white/10 overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">
            Olivia's Recommendation for You
          </h3>
        </div>
        
        <p className="text-white/70 text-sm mb-6">
          Based on {weather.temperature && `${weather.temperature}°F`} {weather.condition && weather.condition}{' '}
          weather and your {situation} plans
        </p>
        
        {isLoading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="animate-pulse text-center">
              <div className="h-12 w-12 rounded-full bg-purple-600/50 mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white/70" />
              </div>
              <p className="text-white/70">Olivia is creating your outfit...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {selectedItems.map((item, index) => (
                <div 
                  key={index}
                  className="bg-slate-800/50 rounded-lg border border-white/10 overflow-hidden aspect-square relative group"
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-2 w-full">
                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                      <p className="text-white/70 text-xs truncate">{item.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {enableShuffle && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleShuffleOutfit}
                  className="border-purple-500/30 text-white hover:bg-purple-800/20"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Shuffle Outfit
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default OliviaRecommendationSection;
