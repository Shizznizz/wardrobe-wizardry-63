
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ShoppingCart, BookmarkPlus, Clock, MapPin, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Outfit, ClothingItem, WeatherInfo } from '@/lib/types';

interface DailyOutfitSectionProps {
  weather?: WeatherInfo;
  currentOutfit?: Outfit;
  clothingItems: ClothingItem[];
  situation?: string;
}

const DailyOutfitSection = ({ weather, currentOutfit, clothingItems, situation }: DailyOutfitSectionProps) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  
  if (!currentOutfit) {
    return (
      <div className="bg-slate-900/70 border border-white/10 rounded-xl p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-64 w-full md:w-1/2 rounded-xl" />
          <div className="space-y-4 md:w-1/2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Choose descriptive text based on situation
  const getSituationText = () => {
    switch(situation?.toLowerCase()) {
      case 'work':
        return 'Perfect for Work';
      case 'sport':
        return 'Ideal for Sports & Activity';
      case 'formal':
        return 'Elegant Formal Outfit';
      case 'party':
        return 'Party-Ready Look';
      case 'casual':
      default:
        return 'Casual Everyday Style';
    }
  };

  // Find a clothing item to use as the main image
  const mainItem = clothingItems.find(item => 
    currentOutfit.items && currentOutfit.items.includes(item.id)
  );
  
  // Get key pieces (up to 3)
  const keyPieces = currentOutfit.items
    ? currentOutfit.items.slice(0, 3).map(itemId => {
        const item = clothingItems.find(i => i.id === itemId);
        return item ? item.name : 'Unknown item';
      })
    : [];

  const handleSaveToWardrobe = () => {
    setIsSaved(true);
    toast.success('Outfit saved to your wardrobe!');
  };

  const handleTryOnOlivia = () => {
    navigate('/fitting-room', { state: { outfitId: currentOutfit.id } });
  };

  const handleShopSimilar = () => {
    navigate('/shop-and-try', { state: { tags: currentOutfit.tags } });
  };

  return (
    <div className="bg-slate-900/70 border border-white/10 rounded-xl overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-pink-400">
              {getSituationText()}
            </h2>
            
            {/* Tags moved below the title */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {currentOutfit.tags?.map((tag, idx) => (
                <Badge 
                  key={idx}
                  variant="outline" 
                  className="bg-purple-500/20 border-purple-400/30 text-purple-200 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {weather && (
            <div className="bg-slate-800/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-700/50 flex items-center text-sm">
              <span className="font-medium text-white">{weather.temperature}°C</span>
              <span className="mx-2 text-white/50">|</span>
              <span className="text-white/80">{weather.condition}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-80 overflow-hidden rounded-xl border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
              <img 
                src={mainItem?.imageUrl || '/placeholder.svg'} 
                alt={currentOutfit.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 z-20">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {currentOutfit.name}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white/90 font-medium">Key Pieces</h3>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex text-xs text-white/70 items-center gap-1 bg-slate-800/80 rounded-full px-2 py-1">
                        <HelpCircle className="h-3 w-3" />
                        <span>About this outfit</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 border-slate-700 text-white max-w-xs">
                      <p>
                        Picked for you based on {weather ? `today's weather in ${weather.city}` : 'your location'} and your style preferences.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <ul className="space-y-2">
                {keyPieces.map((piece, index) => (
                  <li key={index} className="flex items-center gap-2 text-white/80">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                    <span>{piece}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center text-xs text-white/60 gap-6">
              {weather && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{weather.city}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Updated today</span>
              </div>
            </div>
            
            {/* Compact action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleTryOnOlivia}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex-1"
                size="sm"
              >
                <User className="mr-1.5 h-4 w-4" />
                Try on Olivia
              </Button>
              
              <Button
                onClick={handleSaveToWardrobe}
                variant="outline"
                size="sm"
                className={`border-purple-400/30 text-white hover:bg-white/10 flex-1 ${isSaved ? 'bg-purple-500/20 border-purple-400/50' : ''}`}
                disabled={isSaved}
              >
                <BookmarkPlus className="mr-1.5 h-4 w-4" />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              
              <Button
                onClick={handleShopSimilar}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 flex-1"
              >
                <ShoppingCart className="mr-1.5 h-4 w-4" />
                Shop Similar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyOutfitSection;
