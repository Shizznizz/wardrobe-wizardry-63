
import { ClothingItem, Outfit } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Download, Share2, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import OliviaImageBadge from '@/components/outfits/OliviaImageBadge';

interface VirtualFittingRoomProps {
  finalImage: string | null;
  outfit: Outfit | null;
  clothingItems: ClothingItem[];
  isProcessing: boolean;
  userPhoto?: string | null;
  className?: string;
  onSaveLook?: () => void;
  isOliviaImage?: boolean; // New prop to indicate if using Olivia's image
}

const VirtualFittingRoom = ({ 
  finalImage, 
  outfit, 
  clothingItems,
  isProcessing,
  userPhoto,
  className,
  onSaveLook,
  isOliviaImage = false
}: VirtualFittingRoomProps) => {
  const isMobile = useIsMobile();
  
  const handleDownload = async () => {
    if (!finalImage) return;
    
    try {
      const response = await fetch(finalImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'virtual-try-on.png';
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
        const file = new File([blob], 'virtual-try-on.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My Virtual Try-On',
          text: 'Check out how this outfit looks on me!',
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

  // Get a subset of clothing items to show as miniatures
  const previewItems = clothingItems.slice(0, isMobile ? 3 : 4);

  // Display user photo if provided, otherwise show the usual content
  if (userPhoto && !finalImage && !isProcessing) {
    return (
      <div className={`neo-blur border border-white/10 rounded-lg p-3 sm:p-4 h-full ${className}`}>
        <div className="relative h-full flex flex-col">
          <OliviaImageBadge isVisible={isOliviaImage} />
          <div className="flex-grow relative overflow-hidden rounded-lg">
            <AnimatePresence>
              <motion.img 
                key="user-photo"
                src={userPhoto} 
                alt="Your uploaded photo" 
                className="w-full h-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <p className="text-white text-center px-4 py-2 rounded-lg bg-black/50 max-w-xs">
                Select an outfit to see how it looks on your photo
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!finalImage && !isProcessing) {
    return (
      <div className={`neo-blur border border-white/10 rounded-lg p-3 sm:p-6 h-full flex flex-col items-center justify-center text-center ${className}`}>
        <div className="text-white/70 text-sm sm:text-base">
          Upload a photo and select an outfit to see the result
        </div>
      </div>
    );
  }

  return (
    <div className={`neo-blur border border-white/10 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 ${className}`}>
      {isProcessing ? (
        <div className="space-y-3 sm:space-y-4">
          <Skeleton className="w-full aspect-square rounded-lg bg-white/5" />
          <div className="flex justify-center">
            <p className="text-white/70 text-sm">Processing your virtual try-on...</p>
          </div>
        </div>
      ) : finalImage ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div 
              key={finalImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <OliviaImageBadge isVisible={isOliviaImage} />
              <img 
                src={finalImage} 
                alt="Virtual try-on result" 
                className="w-full rounded-lg shadow-xl"
              />
              
              {outfit && (
                <motion.div 
                  className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-black/70 backdrop-blur-md p-2 sm:p-4 rounded-lg border border-white/10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <h3 className="text-white font-medium text-xs sm:text-base mb-1 sm:mb-2">{outfit.name}</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {outfit.seasons.map(season => (
                      <span 
                        key={season} 
                        className="text-[10px] sm:text-xs py-0.5 px-1.5 sm:px-2 bg-white/10 rounded-full capitalize text-white"
                      >
                        {season}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Outfit miniatures */}
          {previewItems.length > 0 && (
            <div className="py-2 sm:py-3">
              <h4 className="text-white/80 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Related items:</h4>
              <div className="flex gap-1 sm:gap-2 overflow-x-auto py-1 px-1 pb-2 scrollbar-none">
                {previewItems.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden border border-white/20 hover:border-white/40 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <img 
                      src={item.imageUrl || '/placeholder.svg'} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className={`flex flex-wrap gap-2 ${isMobile ? 'flex-col' : 'justify-end'}`}>
            {/* Save Look button */}
            <Button 
              variant="default" 
              size={isMobile ? "default" : "sm"}
              onClick={onSaveLook}
              className={`${isMobile ? 'w-full text-sm h-9' : ''} bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white`}
            >
              <Heart className="h-4 w-4 mr-2" />
              Save Look
            </Button>
            
            {/* Share button - only show if Web Share API is supported */}
            {navigator.share && (
              <Button 
                variant="outline" 
                size={isMobile ? "default" : "sm"}
                onClick={handleShare}
                className={`${isMobile ? 'w-full text-sm h-9' : ''} bg-white/5 border-white/20 text-white hover:bg-white/10`}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
            
            {/* Download button */}
            <Button 
              variant="outline" 
              size={isMobile ? "default" : "sm"}
              onClick={handleDownload}
              className={`${isMobile ? 'w-full text-sm h-9' : ''} bg-white/5 border-white/20 text-white hover:bg-white/10`}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default VirtualFittingRoom;
