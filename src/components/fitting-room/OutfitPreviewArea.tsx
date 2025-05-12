
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Download, Heart, ArrowLeft, Eye, Shuffle, User } from 'lucide-react';
import { ShirtIcon, PantsIcon } from '@/components/ui/icons';
import { ClothingItem, Outfit } from '@/lib/types';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import OutfitImageGrid from '@/components/outfits/OutfitImageGrid';

interface OutfitPreviewAreaProps {
  finalImage: string | null;
  userPhoto: string | null;
  selectedOutfit: Outfit | null;
  isProcessingTryOn: boolean;
  isUsingOliviaImage: boolean;
  clothingItems: ClothingItem[];
  onSaveLook: () => void;
  onDownload: () => void;
  onShare: () => void;
  onResetSelection: () => void;
}

const OutfitPreviewArea = ({
  finalImage,
  userPhoto,
  selectedOutfit,
  isProcessingTryOn,
  isUsingOliviaImage,
  clothingItems,
  onSaveLook,
  onDownload,
  onShare,
  onResetSelection
}: OutfitPreviewAreaProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("outfit");
  const [isSwapping, setIsSwapping] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [showOliviaTip, setShowOliviaTip] = useState(false);
  
  // Fashion compliments from Olivia that will show after a look is tried on
  const fashionCompliments = [
    "This look really brings out your style! 💖",
    "Perfect choice for your coloring! ✨",
    "Love how this silhouette works for you! 🌟",
    "This combo is pure confidence! 💃",
    "Great balance of casual and chic! 👌"
  ];
  
  const handleToggleLove = () => {
    setIsLoved(!isLoved);
    toast.success(isLoved ? "Removed from favorites" : "Added to your favorite looks!");
  };
  
  React.useEffect(() => {
    // Show Olivia's fashion tip when an outfit is selected
    if (finalImage && selectedOutfit) {
      const timer = setTimeout(() => {
        setShowOliviaTip(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [finalImage, selectedOutfit]);
  
  // Helper function to get clothing item by ID
  const getClothingItemById = (id: string): ClothingItem | undefined => {
    return clothingItems.find(item => item && item.id === id);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12"
      id="preview-section"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          Your Style Mirror
        </motion.h2>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/5"
          onClick={onResetSelection}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Try Another Look
        </Button>
      </div>
      
      <Card className="glass-dark border-white/10 overflow-hidden shadow-xl shadow-purple-900/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`preview-${finalImage || 'empty'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <h3 className="text-lg font-medium text-white/90 mb-3">
                    {isUsingOliviaImage ? "Here's how it looks on Olivia" : "Here's how it looks on you"}
                  </h3>
                  <div className="overflow-hidden rounded-xl relative">
                    {/* Magical mirror effect */}
                    {finalImage && (
                      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 animate-pulse opacity-40 rounded-xl"></div>
                    )}
                    
                    <VirtualFittingRoom 
                      finalImage={finalImage}
                      outfit={selectedOutfit}
                      clothingItems={clothingItems}
                      isProcessing={isProcessingTryOn}
                      userPhoto={userPhoto}
                      isOliviaImage={isUsingOliviaImage}
                      className="rounded-xl overflow-hidden transition-all border-2 border-white/5 relative z-10"
                      onSaveLook={onSaveLook}
                    />
                    
                    {/* Floating Olivia tip */}
                    <AnimatePresence>
                      {showOliviaTip && finalImage && (
                        <motion.div 
                          className="absolute bottom-4 left-4 right-4 z-20 bg-black/70 backdrop-blur-sm p-3 rounded-lg border border-purple-500/20"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ type: "spring" }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-white text-sm">
                              {fashionCompliments[Math.floor(Math.random() * fashionCompliments.length)]}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex flex-col">
              {selectedOutfit && (
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-white mb-2">{selectedOutfit.name}</h3>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {selectedOutfit.seasons.map(season => (
                      <Badge 
                        key={season}
                        variant="outline"
                        className="bg-white/5 text-purple-200 border-purple-400/30"
                      >
                        {season}
                      </Badge>
                    ))}
                    {selectedOutfit.occasions && selectedOutfit.occasions.map(occasion => (
                      <Badge 
                        key={occasion}
                        variant="outline"
                        className="bg-white/5 text-blue-200 border-blue-400/30"
                      >
                        {occasion}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Display outfit items preview */}
                  <div className="bg-slate-800/50 rounded-lg p-4 mb-4 relative overflow-hidden">
                    <h4 className="text-sm font-medium text-white/90 mb-3">Items in this outfit</h4>
                    {selectedOutfit.items && selectedOutfit.items.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {selectedOutfit.items.slice(0, 4).map((itemId, index) => {
                          const item = getClothingItemById(itemId);
                          return (
                            <motion.div 
                              key={index} 
                              className="border border-white/10 rounded overflow-hidden bg-slate-900 hover:border-white/30 transition-colors"
                              whileHover={{ scale: 1.03 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              {item?.imageUrl ? (
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-white/40 text-xs p-2 text-center">
                                  {item?.name || 'Item unavailable'}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-white/50 text-sm">No items in this outfit</div>
                    )}
                  </div>
                  
                  {/* Outfit swap functionality */}
                  <div className="bg-white/5 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-medium text-white/90 mb-2">Want to tweak this outfit? Tap below to swap items</h4>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 border-white/10 text-white"
                      >
                        <ShirtIcon className="h-4 w-4 mr-2" />
                        Swap Top
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 border-white/10 text-white"
                      >
                        <PantsIcon className="h-4 w-4 mr-2" />
                        Swap Bottom
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-auto">
                <p className="text-sm text-white/70 mb-3">Style Actions:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <Button 
                    variant="default" 
                    className={`bg-gradient-to-r ${isLoved 
                      ? 'from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700' 
                      : 'from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'} text-white hover:shadow-[0_0_15px_rgba(147,51,234,0.3)]`}
                    onClick={handleToggleLove}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isLoved ? 'fill-white' : ''}`} />
                    {isLoved ? 'Loved!' : 'Love This Look'}
                  </Button>
                  
                  <Button 
                    variant="default" 
                    className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white hover:shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                    onClick={onSaveLook}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Save Look
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {navigator.share && (
                    <Button 
                      variant="outline" 
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                      onClick={onShare}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                    onClick={onDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OutfitPreviewArea;
