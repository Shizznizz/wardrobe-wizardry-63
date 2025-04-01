
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import { ClothingItem, Outfit } from '@/lib/types';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import AiTryOnButton from './AiTryOnButton';
import PredictionPoller from './PredictionPoller';
import OutfitCustomizationPanel from './OutfitCustomizationPanel';
import OutfitActionButtons from './OutfitActionButtons';

interface OutfitPreviewSectionProps {
  finalImage: string | null;
  selectedOutfit: Outfit | null;
  clothingItems: ClothingItem[];
  isProcessingTryOn: boolean;
  userPhoto: string | null;
  isUsingOliviaImage: boolean;
  onSaveLook: () => void;
}

const OutfitPreviewSection = ({
  finalImage,
  selectedOutfit,
  clothingItems,
  isProcessingTryOn,
  userPhoto,
  isUsingOliviaImage,
  onSaveLook
}: OutfitPreviewSectionProps) => {
  const [showClothingOptions, setShowClothingOptions] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
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

  const handleGenerationStart = () => {
    setIsGeneratingAI(true);
  };

  const handleImageGenerated = (imageUrl: string, newPredictionId: string | null) => {
    setAiGeneratedImage(imageUrl);
    setPredictionId(newPredictionId);
    if (!newPredictionId) {
      setIsGeneratingAI(false);
    }
  };

  const handlePredictionComplete = (imageUrl: string) => {
    setAiGeneratedImage(imageUrl);
    setIsGeneratingAI(false);
    setPredictionId(null);
  };

  // Display AI-generated image if available, otherwise show the regular final image
  const displayImage = aiGeneratedImage || finalImage;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <Card className="glass-dark border-white/10 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Outfit Preview</h2>
            
            <OutfitActionButtons 
              selectedOutfit={selectedOutfit}
              userPhoto={userPhoto}
              finalImage={displayImage}
              showClothingOptions={showClothingOptions}
              onToggleOptions={handleToggleOptions}
              aiTryOnButton={
                <AiTryOnButton
                  selectedOutfit={selectedOutfit}
                  userPhoto={userPhoto}
                  onGenerationStart={handleGenerationStart}
                  onImageGenerated={handleImageGenerated}
                />
              }
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${showClothingOptions ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <VirtualFittingRoom 
                finalImage={displayImage}
                outfit={selectedOutfit}
                clothingItems={clothingItems}
                isProcessing={isProcessingTryOn || isGeneratingAI}
                userPhoto={userPhoto}
                onSaveLook={onSaveLook}
                isOliviaImage={isUsingOliviaImage}
                className="flex-grow"
              />
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
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default OutfitPreviewSection;
