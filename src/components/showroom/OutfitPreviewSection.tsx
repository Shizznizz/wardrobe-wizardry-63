
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import { ClothingItem, Outfit } from '@/lib/types';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import PredictionPoller from './PredictionPoller';
import OutfitCustomizationPanel from './OutfitCustomizationPanel';
import OutfitActionButtons from './OutfitActionButtons';
import { Button } from '@/components/ui/button';
import { Camera, ArrowLeft } from 'lucide-react';

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
  clothingPhoto,
  isUsingOliviaImage,
  onSaveLook,
  onChangePhoto
}: OutfitPreviewSectionProps) => {
  const [showClothingOptions, setShowClothingOptions] = useState(false);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const handleToggleOptions = () => {
    setShowClothingOptions(!showClothingOptions);
  };
  
  const handleMatchItem = (item: ClothingItem) => {
    console.log('Adding item to outfit:', item);
  };
  
  const handleToggleFavorite = (id: string) => {
    console.log('Toggle favorite for item:', id);
  };

  const handlePredictionComplete = (imageUrl: string) => {
    setPredictionId(null);
  };
  
  const handlePredictionError = (error: string) => {
    console.error("Prediction error:", error);
    setGenerationError(error);
    setPredictionId(null);
  };

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
              Outfit Preview
            </motion.h2>
            
            <OutfitActionButtons 
              selectedOutfit={selectedOutfit}
              userPhoto={userPhoto}
              finalImage={finalImage}
              showClothingOptions={showClothingOptions}
              onToggleOptions={handleToggleOptions}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${showClothingOptions ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`preview-${finalImage || 'empty'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {userPhoto && !finalImage && (
                    <motion.div
                      className="absolute top-4 left-4 z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="bg-black/40 hover:bg-black/60 text-white"
                        onClick={onChangePhoto}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                    </motion.div>
                  )}
                  
                  <VirtualFittingRoom 
                    finalImage={finalImage}
                    outfit={selectedOutfit}
                    clothingItems={clothingItems}
                    isProcessing={isProcessingTryOn}
                    userPhoto={userPhoto}
                    clothingPhoto={clothingPhoto}
                    onSaveLook={onSaveLook}
                    isOliviaImage={isUsingOliviaImage}
                    className="rounded-xl overflow-hidden shadow-lg transition-all"
                  />
                </motion.div>
              </AnimatePresence>
              
              {generationError && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-md text-red-200 text-sm">
                  <p>AI generation error: {generationError}</p>
                  <p className="mt-1">Please try again or choose a different outfit/photo combination.</p>
                </div>
              )}
            </div>
            
            {showClothingOptions && (
              <OutfitCustomizationPanel
                clothingItems={clothingItems}
                onToggleFavorite={handleToggleFavorite}
                onMatchItem={handleMatchItem}
              />
            )}
          </div>
          
          {/* Hidden component to handle polling */}
          <PredictionPoller
            predictionId={predictionId}
            onPredictionComplete={handlePredictionComplete}
            onPredictionError={handlePredictionError}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default OutfitPreviewSection;
