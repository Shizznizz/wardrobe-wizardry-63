
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, Shuffle, X, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Outfit, ClothingItem } from '@/lib/types';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { sampleClothingItems } from '@/lib/wardrobeData';
import OliviaImageBadge from '@/components/outfits/OliviaImageBadge';
import OutfitItemSwapPanel from '@/components/fitting-room/OutfitItemSwapPanel';

interface TryOnExperienceProps {
  userPhoto: string | null;
  finalImage: string | null;
  selectedOutfit: Outfit | null;
  isProcessingTryOn: boolean;
  isUsingOliviaImage: boolean;
  showOptions: boolean;
  onSaveLook: () => void;
  onClearSelection: () => void;
  onToggleOptions: () => void;
  onHandleSwapItem: (oldItem: ClothingItem, newItem: ClothingItem) => void;
}

const TryOnExperience = ({
  userPhoto,
  finalImage,
  selectedOutfit,
  isProcessingTryOn,
  isUsingOliviaImage,
  showOptions,
  onSaveLook,
  onClearSelection,
  onToggleOptions,
  onHandleSwapItem
}: TryOnExperienceProps) => {
  const [showSwapPanel, setShowSwapPanel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Get compatible clothing items for swapping (simulated)
  const getCompatibleItems = (category: string) => {
    return sampleClothingItems.filter(item => item.type === category).slice(0, 6);
  };
  
  // Find matching clothing items for the outfit (simulated)
  const outfitItems = selectedOutfit 
    ? selectedOutfit.items.map(id => 
        sampleClothingItems.find(item => item.id === id) || 
        sampleClothingItems[Math.floor(Math.random() * sampleClothingItems.length)]
      )
    : [];
  
  const handleDownload = async () => {
    if (!finalImage) return;
    
    try {
      const response = await fetch(finalImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fitting-room-preview.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };
  
  const handleShare = async () => {
    if (!finalImage) return;
    
    try {
      if (navigator.share) {
        const response = await fetch(finalImage);
        const blob = await response.blob();
        const file = new File([blob], 'fitting-room-preview.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My Outfit from Fitting Room',
          text: 'Check out this outfit I created!',
          files: [file]
        });
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Sharing is not supported on this device');
    }
  };
  
  const handleSwapItem = (item: ClothingItem) => {
    if (!selectedCategory) return;
    
    const oldItem = outfitItems.find(i => i.type === selectedCategory);
    if (!oldItem) return;
    
    onHandleSwapItem(oldItem, item);
    setShowSwapPanel(false);
    setSelectedCategory(null);
  };
  
  const handleShowSwapOptions = (category: string) => {
    setSelectedCategory(category);
    setShowSwapPanel(true);
  };
  
  if (!userPhoto) {
    return null;
  }
  
  return (
    <Card className="glass-dark border-white/10 overflow-hidden">
      <CardContent className="p-4">
        <div className="relative">
          <OliviaImageBadge isVisible={isUsingOliviaImage} />
          
          {/* Try-On Preview */}
          <AnimatePresence mode="wait">
            {isProcessingTryOn ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="aspect-[3/4] w-full"
              >
                <Skeleton className="w-full h-full rounded-lg bg-white/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-white/70">Processing your outfit...</p>
                  </div>
                </div>
              </motion.div>
            ) : finalImage && selectedOutfit ? (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                <img 
                  src={finalImage} 
                  alt="Try-on result" 
                  className="w-full aspect-[3/4] object-cover rounded-lg"
                />
                
                {/* Outfit details overlay */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 backdrop-blur-sm"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">{selectedOutfit.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedOutfit.seasons.map(season => (
                          <Badge 
                            key={season}
                            variant="outline" 
                            className="text-[10px] py-0 px-1.5 border-blue-500/20 text-blue-200"
                          >
                            {season}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 rounded-full bg-black/60 border-white/20 text-white"
                      onClick={onClearSelection}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="photo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                <img 
                  src={userPhoto} 
                  alt="Your photo" 
                  className="w-full aspect-[3/4] object-cover rounded-lg"
                />
                
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center max-w-xs px-6">
                    <p className="text-white/90 mb-4">Select an outfit from your wardrobe to see how it looks on you</p>
                    <Button 
                      variant="outline" 
                      className="bg-white/10 border-white/20 text-white"
                      onClick={onClearSelection}
                    >
                      Change Photo
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Action buttons */}
          {finalImage && selectedOutfit && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={onSaveLook}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              >
                Save Look
              </Button>
              
              <Button
                variant="outline"
                className="bg-white/5 border-white/20 text-white"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              {navigator.share && (
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/20 text-white"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          )}
          
          {/* Swap items section */}
          {finalImage && selectedOutfit && (
            <motion.div
              initial={false}
              animate={{ height: showOptions ? 'auto' : '0px', opacity: showOptions ? 1 : 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Outfit Items</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-white/70 hover:text-white"
                    onClick={onToggleOptions}
                  >
                    {showOptions ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {outfitItems.slice(0, 6).map((item, index) => (
                    <div 
                      key={index} 
                      className="relative group cursor-pointer"
                      onClick={() => handleShowSwapOptions(item.type)}
                    >
                      <div className="aspect-square rounded-md overflow-hidden bg-slate-800/60">
                        <img 
                          src={item.imageUrl || '/placeholder.svg'} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Shuffle className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-[10px] mt-1 text-center text-white/80 truncate">
                        {item.type}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Toggle button for options */}
          {finalImage && selectedOutfit && !showOptions && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full bg-white/5 border-white/20 text-white"
              onClick={onToggleOptions}
            >
              <Plus className="h-3 w-3 mr-1" />
              Outfit Details & Swap Items
            </Button>
          )}
        </div>
      </CardContent>
      
      {/* Swap panel */}
      <OutfitItemSwapPanel
        isOpen={showSwapPanel}
        onClose={() => setShowSwapPanel(false)}
        category={selectedCategory || ''}
        items={selectedCategory ? getCompatibleItems(selectedCategory) : []}
        onSelectItem={handleSwapItem}
      />
    </Card>
  );
};

export default TryOnExperience;
