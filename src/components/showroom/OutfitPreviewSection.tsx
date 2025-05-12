
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ClothingItem, Outfit } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Camera, ArrowLeft, Download, Share } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import UserPhotoDisplay from '@/components/fitting-room/UserPhotoDisplay';

interface OutfitPreviewSectionProps {
  finalImage: string | null;
  selectedOutfit: Outfit | null;
  clothingItems: ClothingItem[];
  isProcessingTryOn: boolean;
  userPhoto: string | null;
  clothingPhoto?: string | null;
  isUsingOliviaImage: boolean;
  onSaveLook: () => void;
  onChangePhoto?: () => void;
}

const OutfitPreviewSection = ({
  finalImage,
  selectedOutfit,
  clothingItems,
  isProcessingTryOn,
  userPhoto,
  isUsingOliviaImage,
  onSaveLook,
  onChangePhoto
}: OutfitPreviewSectionProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <Card className="glass-dark border-white/10 overflow-hidden shadow-xl shadow-purple-900/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <motion.h2 
              className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Virtual Preview
            </motion.h2>
            
            <div className="flex items-center gap-2">
              {finalImage && (
                <>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={onSaveLook}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <p className="text-white/70 mb-6">
            See the selected outfit rendered on your uploaded image.
          </p>
          
          <AnimatePresence mode="wait">
            {/* Processing state */}
            {isProcessingTryOn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="processing"
                className="flex flex-col items-center justify-center min-h-[400px] p-8"
              >
                <div className="w-24 h-24 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-medium mb-2 text-white">Creating your virtual try-on...</h3>
                <p className="text-white/70 text-center max-w-md">
                  We're generating your personalized outfit preview. This should only take a few seconds.
                </p>
              </motion.div>
            )}
            
            {/* No image or outfit selected */}
            {!isProcessingTryOn && (!userPhoto || !selectedOutfit) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="empty"
                className="flex flex-col items-center justify-center bg-slate-900/40 border border-white/10 rounded-lg min-h-[400px] p-8 text-center"
              >
                <div className="h-20 w-20 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-sm mb-4">
                  <Camera className="h-10 w-10 text-white/40" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-white">Ready for your virtual try-on</h3>
                <p className="text-white/70 text-center max-w-md mb-6">
                  {!userPhoto && !selectedOutfit ? (
                    "Upload a photo and select an outfit to see the virtual try-on preview."
                  ) : !userPhoto ? (
                    "Upload a photo first to see how this outfit will look on you."
                  ) : (
                    "Now select an outfit to try on."
                  )}
                </p>
                
                {userPhoto && !selectedOutfit ? (
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => {
                      document.getElementById('outfit-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Select an Outfit
                  </Button>
                ) : !userPhoto && selectedOutfit ? (
                  <Button
                    onClick={onChangePhoto}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Upload Your Photo
                  </Button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={onChangePhoto}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Upload Your Photo
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-purple-100"
                      onClick={() => {
                        document.getElementById('outfit-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Browse Outfits
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Final image preview */}
            {!isProcessingTryOn && userPhoto && selectedOutfit && finalImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="preview"
                className="rounded-lg overflow-hidden"
              >
                <div className="aspect-auto max-h-[600px] overflow-hidden flex items-center justify-center rounded-lg">
                  <motion.img 
                    src={finalImage} 
                    alt="Virtual try-on result" 
                    className="w-full h-auto object-contain max-h-[600px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onChangePhoto}
                    className="text-sm border-white/20 text-white/80 hover:bg-white/5 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Change Model
                  </Button>
                  
                  <div className="flex gap-1">
                    {selectedOutfit.seasons?.map(season => (
                      <Badge 
                        key={season} 
                        variant="outline" 
                        className="text-xs bg-blue-900/30 text-blue-200 border-blue-400/30"
                      >
                        {season}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OutfitPreviewSection;
