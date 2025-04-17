
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Shirt, Info, Lock } from 'lucide-react';
import { ClothingItem } from '@/lib/types';

interface PersonalizedStyleCarouselProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onStyleTips: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const PersonalizedStyleCarousel = ({
  isPremiumUser,
  onTryItem,
  onStyleTips,
  onUpgradeToPremium
}: PersonalizedStyleCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const personalizedItems: ClothingItem[] = [
    {
      id: 'personal-1',
      name: 'Sustainable Knit Sweater',
      type: 'sweater',
      color: 'beige',
      material: 'wool',
      season: ['autumn', 'winter'],
      occasions: ['casual'],
      imageUrl: 'https://images.unsplash.com/photo-1608842850209-ed2858135ea0?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date()
    },
    {
      id: 'personal-2',
      name: 'Essential Slim Jeans',
      type: 'pants',
      color: 'blue',
      material: 'denim',
      season: ['all'],
      occasions: ['casual'],
      imageUrl: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date()
    },
    {
      id: 'personal-3',
      name: 'Minimalist Silk Blouse',
      type: 'shirt',
      color: 'white',
      material: 'silk',
      season: ['spring', 'summer'],
      occasions: ['work'],
      imageUrl: 'https://images.unsplash.com/photo-1644950905342-f28177e9aa96?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date()
    }
  ];
  
  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? personalizedItems.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev === personalizedItems.length - 1 ? 0 : prev + 1));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Personalized for Your Style
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="relative">
        {!isPremiumUser && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
            <Lock className="h-10 w-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Premium Feature</h3>
            <p className="text-white/70 text-center max-w-md mb-4">
              Unlock personalized style recommendations based on your preferences and past choices.
            </p>
            <Button 
              onClick={onUpgradeToPremium}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Upgrade to Premium
            </Button>
          </div>
        )}
        
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/30 border border-white/10 hover:bg-black/50 text-white"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="flex-1 px-4 overflow-hidden">
            <div className="flex justify-center">
              {personalizedItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`transition-all duration-500 ${
                    index === activeIndex
                      ? 'w-full opacity-100 scale-100'
                      : 'w-0 opacity-0 scale-90'
                  }`}
                >
                  {index === activeIndex && (
                    <Card className="border-0 shadow-md bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-white/10 backdrop-blur-lg overflow-hidden max-w-2xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="relative aspect-square md:aspect-auto">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <CardContent className="p-6 flex flex-col justify-center">
                          <span className="text-purple-400 text-sm mb-2">Perfect Match for You</span>
                          <h3 className="text-xl font-medium text-white mb-2">{item.name}</h3>
                          
                          <p className="text-white/70 mb-6">
                            This item complements your style profile and works with multiple pieces in your wardrobe.
                          </p>
                          
                          <div className="flex gap-3">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                              onClick={() => onTryItem(item)}
                            >
                              <Shirt className="h-4 w-4 mr-2" />
                              Try On
                            </Button>
                            
                            <Button 
                              variant="outline"
                              className="flex-1 border-white/20 hover:bg-white/10"
                              onClick={() => onStyleTips(item)}
                            >
                              <Info className="h-4 w-4 mr-2" />
                              Styling Tips
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-4 gap-1">
              {personalizedItems.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? 'w-8 bg-purple-500'
                      : 'w-2 bg-white/20'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/30 border border-white/10 hover:bg-black/50 text-white"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalizedStyleCarousel;
