
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Heart, Eye, Save } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { sampleOutfits } from '@/lib/wardrobeData';
import { toast } from 'sonner';

interface TrendingLooksProps {
  onShowLogin: () => void;
}

const TrendingLooks = ({ onShowLogin }: TrendingLooksProps) => {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(0);
  const [likedOutfits, setLikedOutfits] = useState<Record<string, boolean>>({});
  const [savedOutfits, setSavedOutfits] = useState<Record<string, boolean>>({});
  
  // Use a subset of sample outfits for trending looks
  const trendingOutfits = sampleOutfits?.slice(0, 8) || [];
  const outfitsPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(trendingOutfits.length / outfitsPerPage);
  
  const handleNext = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };
  
  const handlePrev = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  
  const currentOutfits = trendingOutfits.slice(
    page * outfitsPerPage,
    (page + 1) * outfitsPerPage
  );

  const handleLike = (outfitId: string) => {
    setLikedOutfits(prev => ({
      ...prev,
      [outfitId]: !prev[outfitId]
    }));
    
    toast.success(
      likedOutfits[outfitId] ? 'Removed from liked outfits' : 'Added to your liked outfits'
    );
  };
  
  const handleSave = (outfitId: string) => {
    if (!savedOutfits[outfitId]) {
      onShowLogin();
    } else {
      setSavedOutfits(prev => ({
        ...prev,
        [outfitId]: false
      }));
      toast.success('Removed from saved collection');
    }
  };
  
  const handleTryOutfit = () => {
    onShowLogin();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-16 mb-16"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
          Trending in Community
        </h2>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="h-8 w-8 rounded-full bg-white/5 border-white/10"
            disabled={totalPages <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="h-8 w-8 rounded-full bg-white/5 border-white/10"
            disabled={totalPages <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatePresence mode="wait">
          {currentOutfits.map((outfit, index) => (
            <motion.div
              key={`${outfit.id}-${page}-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-dark border border-white/10 rounded-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={'/placeholder.svg'} 
                  alt={outfit.name || `Trending outfit ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-sm font-medium text-white">{outfit.name}</h3>
                  
                  <div className="flex flex-wrap gap-1 mt-1">
                    {outfit.seasons?.slice(0, 2).map(season => (
                      <Badge
                        key={season}
                        variant="outline"
                        className="text-xs bg-black/30 border-white/20"
                      >
                        {season}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleLike(outfit.id || '')}
                    className={`h-8 w-8 rounded-full ${
                      likedOutfits[outfit.id || ''] 
                        ? 'bg-pink-600 border-pink-400' 
                        : 'bg-black/40 backdrop-blur-sm border-white/20'
                    }`}
                  >
                    <Heart 
                      className={`h-4 w-4 ${likedOutfits[outfit.id || ''] ? 'fill-white text-white' : ''}`} 
                    />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSave(outfit.id || '')}
                    className={`h-8 w-8 rounded-full ${
                      savedOutfits[outfit.id || ''] 
                        ? 'bg-purple-600 border-purple-400' 
                        : 'bg-black/40 backdrop-blur-sm border-white/20'
                    }`}
                  >
                    <Save 
                      className={`h-4 w-4 ${savedOutfits[outfit.id || ''] ? 'fill-white text-white' : ''}`} 
                    />
                  </Button>
                </div>
              </div>
              
              <div className="p-3">
                <Button 
                  onClick={handleTryOutfit}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  size="sm"
                >
                  <Eye className="h-3.5 w-3.5 mr-2" />
                  Try This Look
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
          onClick={onShowLogin}
        >
          View More Trending Outfits
        </Button>
      </div>
    </motion.div>
  );
};

export default TrendingLooks;
