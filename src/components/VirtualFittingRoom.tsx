
import { ClothingItem, Outfit } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface VirtualFittingRoomProps {
  finalImage: string | null;
  outfit: Outfit | null;
  clothingItems: ClothingItem[];
  isProcessing: boolean;
}

const VirtualFittingRoom = ({ 
  finalImage, 
  outfit, 
  clothingItems,
  isProcessing 
}: VirtualFittingRoomProps) => {
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

  if (!finalImage && !isProcessing) {
    return (
      <div className="border rounded-lg p-8 h-full flex flex-col items-center justify-center text-center">
        <div className="text-muted-foreground">
          Upload a photo and select an outfit to see the result
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      {isProcessing ? (
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="flex justify-center">
            <p className="text-muted-foreground">Processing your virtual try-on...</p>
          </div>
        </div>
      ) : finalImage ? (
        <>
          <div className="relative">
            <img 
              src={finalImage} 
              alt="Virtual try-on result" 
              className="w-full rounded-lg"
            />
            
            {outfit && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">{outfit.name}</h3>
                <div className="flex gap-2">
                  {outfit.seasons.map(season => (
                    <span 
                      key={season} 
                      className="text-xs py-0.5 px-2 bg-white/10 rounded-full capitalize text-white"
                    >
                      {season}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleDownload}
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
