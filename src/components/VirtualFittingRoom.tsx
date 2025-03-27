
import { ClothingItem, Outfit } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

interface VirtualFittingRoomProps {
  finalImage: string | null;
  outfit: Outfit | null;
  clothingItems: ClothingItem[];
  isProcessing: boolean;
  userPhoto?: string | null; // Add support for displaying the user's photo
}

const VirtualFittingRoom = ({ 
  finalImage, 
  outfit, 
  clothingItems,
  isProcessing,
  userPhoto
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
      <div className="neo-blur border border-white/10 rounded-lg p-3 sm:p-4 h-full">
        <div className="relative h-full flex flex-col">
          <div className="flex-grow relative overflow-hidden rounded-lg">
            <img 
              src={userPhoto} 
              alt="Your uploaded photo" 
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <p className="text-white text-center px-4 py-2 rounded-lg bg-black/50 max-w-xs">
                Select an outfit to see how it looks on your photo
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!finalImage && !isProcessing) {
    return (
      <div className="neo-blur border border-white/10 rounded-lg p-3 sm:p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="text-white/70 text-sm sm:text-base">
          Upload a photo and select an outfit to see the result
        </div>
      </div>
    );
  }

  return (
    <div className="neo-blur border border-white/10 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
      {isProcessing ? (
        <div className="space-y-3 sm:space-y-4">
          <Skeleton className="w-full aspect-square rounded-lg bg-white/5" />
          <div className="flex justify-center">
            <p className="text-white/70 text-sm">Processing your virtual try-on...</p>
          </div>
        </div>
      ) : finalImage ? (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img 
              src={finalImage} 
              alt="Virtual try-on result" 
              className="w-full rounded-lg shadow-xl"
            />
            
            {outfit && (
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-black/70 backdrop-blur-md p-2 sm:p-4 rounded-lg border border-white/10">
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
              </div>
            )}
          </motion.div>
          
          {/* Outfit miniatures */}
          {previewItems.length > 0 && (
            <div className="py-2 sm:py-3">
              <h4 className="text-white/80 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Related items:</h4>
              <div className="flex gap-1 sm:gap-2 overflow-x-auto py-1 px-1 pb-2 scrollbar-none">
                {previewItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden border border-white/20 hover:border-white/40 transition-colors"
                  >
                    <img 
                      src={item.imageUrl || '/placeholder.svg'} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'justify-end'}`}>
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
            <Button 
              variant="default" 
              size={isMobile ? "default" : "sm"}
              onClick={handleDownload}
              className={`${isMobile ? 'w-full text-sm h-9' : ''} bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white`}
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
