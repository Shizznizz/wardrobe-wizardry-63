
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  Image, 
  Heart, 
  Share2, 
  Download, 
  Star, 
  StarHalf, 
  User, 
  Sparkles, 
  ShoppingBag
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Outfit, ClothingItem } from '@/lib/types';

interface EnhancedPreviewSectionProps {
  userPhoto: string | null;
  clothingPhoto: string | null;
  finalImage: string | null;
  isProcessing: boolean;
  isUsingOliviaImage: boolean;
  generationError: string | null;
  mockOutfit: Outfit | null;
  isPremiumUser: boolean;
  onTryOn: () => void;
  onSaveLook: () => void;
  onShowPremiumPopup: () => void;
}

const EnhancedPreviewSection = ({
  userPhoto,
  clothingPhoto,
  finalImage,
  isProcessing,
  isUsingOliviaImage,
  generationError,
  mockOutfit,
  isPremiumUser,
  onTryOn,
  onSaveLook,
  onShowPremiumPopup
}: EnhancedPreviewSectionProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  
  const handleSaveLook = () => {
    if (!isPremiumUser) {
      onShowPremiumPopup();
      return;
    }
    
    setIsSaved(!isSaved);
    onSaveLook();
  };
  
  const handleRateLook = (value: number) => {
    setRating(value);
    toast.success(`Thank you for rating this look with ${value} stars!`);
  };
  
  const handleRetry = () => {
    onTryOn();
  };
  
  const renderPlaceholder = () => {
    if (isUsingOliviaImage) {
      return (
        <div className="flex flex-col items-center justify-center p-6 gap-4">
          <div className="relative">
            <motion.div 
              className="absolute inset-0 border-2 border-dashed border-purple-500/40 rounded-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <img 
              src={userPhoto || '/placeholder.svg'}
              alt="Olivia"
              className="w-full h-auto max-h-[300px] object-contain rounded-lg"
            />
            <Badge variant="outline" className="absolute top-2 left-2 bg-purple-900/70 text-purple-200 border-purple-500/30">
              <User className="h-3 w-3 mr-1" />
              Olivia model
            </Badge>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-sm">
              Select a clothing item and click "Try On Now" to see how it looks on Olivia!
            </p>
          </div>
        </div>
      );
    }
    
    if (userPhoto) {
      return (
        <div className="flex flex-col items-center justify-center p-6 gap-4">
          <div className="relative">
            <motion.div 
              className="absolute inset-0 border-2 border-dashed border-blue-500/40 rounded-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <img 
              src={userPhoto}
              alt="Your photo"
              className="w-full h-auto max-h-[300px] object-contain rounded-lg"
            />
          </div>
          <div className="text-center">
            <p className="text-white/70 text-sm">
              Select a clothing item and click "Try On Now" to see how it looks on you!
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Image className="h-16 w-16 text-white/20 mb-4" />
        <p className="text-white/60 text-center">
          Upload your photo and select a clothing item to see the preview
        </p>
      </div>
    );
  };
  
  const renderError = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Generation Failed</h3>
        <p className="text-white/70 text-sm mb-4 max-w-xs">
          We couldn't generate your preview. This might be due to server load or an incompatible image.
        </p>
        <p className="text-white/60 text-xs mb-4">
          Tip: Try using a photo with good lighting and a neutral background for best results.
        </p>
        <Button
          onClick={handleRetry}
          variant="outline"
          className="border-red-500/30 text-red-300 hover:bg-red-950/30"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </motion.div>
    );
  };
  
  return (
    <Card className="border-0 shadow-soft bg-slate-900/40 border border-blue-500/20 backdrop-blur-lg overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-blue-100">Preview Result</h3>
          
          {!isPremiumUser && !finalImage && (
            <Badge variant="outline" className="bg-slate-800/80 text-amber-300 border-amber-500/40 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Premium
            </Badge>
          )}
        </div>
        
        <div className="relative rounded-lg overflow-hidden border border-white/10 min-h-[300px] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 border-t-2 border-purple-500 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-white/80">Processing your virtual try-on...</p>
                <p className="text-white/60 text-xs mt-2">This may take a few moments</p>
              </motion.div>
            ) : generationError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {renderError()}
              </motion.div>
            ) : finalImage ? (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full"
              >
                <img
                  src={finalImage}
                  alt="Try-on result"
                  className="w-full h-auto"
                />
                
                {isUsingOliviaImage && (
                  <Badge variant="outline" className="absolute top-3 left-3 bg-purple-900/70 text-purple-200 border-purple-500/30">
                    <User className="h-3 w-3 mr-1" />
                    Olivia model
                  </Badge>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white text-sm font-medium">
                        {mockOutfit?.name || "Your Custom Look"}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {['Casual', 'Summer'].map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-white/20 rounded-full text-white/90">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-full p-2 h-auto ${
                        isSaved 
                          ? 'bg-pink-500/20 border-pink-500/50 text-pink-300' 
                          : 'bg-black/30 border-white/20 text-white/70'
                      }`}
                      onClick={handleSaveLook}
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? 'fill-pink-500' : ''}`} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {renderPlaceholder()}
              </motion.div>
            )}
          </AnimatePresence>
          
          {!isPremiumUser && !isProcessing && !finalImage && (
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-10">
              <div className="text-center p-6 max-w-xs">
                <Sparkles className="h-10 w-10 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Premium Feature</h3>
                <p className="text-white/80 text-sm mb-4">
                  Unlock AI-powered try-on with premium! See exactly how clothes look on you before buying.
                </p>
                <Button 
                  onClick={onShowPremiumPopup}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90"
                >
                  Unlock Premium
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {finalImage && (
          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={handleSaveLook} 
                variant="outline" 
                className={`${
                  isSaved 
                    ? 'border-pink-500/30 text-pink-300 bg-pink-500/10' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
                size="sm"
              >
                <Heart className={`h-3.5 w-3.5 mr-1.5 ${isSaved ? 'fill-pink-300' : ''}`} />
                {isSaved ? 'Saved' : 'Save Look'}
              </Button>
              
              <Button 
                variant="outline" 
                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                size="sm"
              >
                <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                Shop Now
              </Button>
              
              <Button 
                variant="outline" 
                className="border-white/20 text-white/80 hover:bg-white/10"
                size="sm"
              >
                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                Share
              </Button>
              
              <Button 
                variant="outline" 
                className="border-white/20 text-white/80 hover:bg-white/10"
                size="sm"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download
              </Button>
            </div>
            
            <div className="border-t border-white/10 pt-3">
              <p className="text-sm text-white/70 mb-2">How accurate was this try-on?</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button 
                    key={star}
                    variant="ghost" 
                    size="sm"
                    className={`p-1 h-auto ${rating && rating >= star ? 'text-yellow-400' : 'text-white/30 hover:text-white/60'}`}
                    onClick={() => handleRateLook(star)}
                  >
                    <Star className={`h-6 w-6 ${rating && rating >= star ? 'fill-yellow-400' : ''}`} />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedPreviewSection;
