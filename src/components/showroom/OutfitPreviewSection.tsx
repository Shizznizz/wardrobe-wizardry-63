
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import { ClothingItem, Outfit } from '@/lib/types';

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
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <Card className="glass-dark border-white/10 overflow-hidden">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Outfit Preview</h2>
          
          <VirtualFittingRoom 
            finalImage={finalImage}
            outfit={selectedOutfit}
            clothingItems={clothingItems}
            isProcessing={isProcessingTryOn}
            userPhoto={userPhoto}
            onSaveLook={onSaveLook}
            isOliviaImage={isUsingOliviaImage}
            className="flex-grow"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default OutfitPreviewSection;
