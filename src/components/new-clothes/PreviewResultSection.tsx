
import { Outfit, ClothingItem } from '@/lib/types';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import AdditionalItemsSelector from '@/components/outfits/AdditionalItemsSelector';

interface PreviewResultSectionProps {
  finalImage: string | null;
  outfit: Outfit | null;
  clothingItems: ClothingItem[];
  isProcessing: boolean;
  userPhoto: string | null;
  isOliviaImage: boolean;
  isPremiumUser: boolean;
  onSaveLook: () => void;
  onAddItem: (item: ClothingItem) => void;
  onShowPremiumPopup: () => void;
}

const PreviewResultSection = ({
  finalImage,
  outfit,
  clothingItems,
  isProcessing,
  userPhoto,
  isOliviaImage,
  isPremiumUser,
  onSaveLook,
  onAddItem,
  onShowPremiumPopup
}: PreviewResultSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">Preview Result</h2>
      <VirtualFittingRoom 
        finalImage={finalImage}
        outfit={outfit}
        clothingItems={clothingItems}
        isProcessing={isProcessing}
        userPhoto={userPhoto}
        onSaveLook={onSaveLook}
        isOliviaImage={isOliviaImage}
      />
      
      {finalImage && (
        <AdditionalItemsSelector 
          onAddItem={onAddItem}
          onPremiumClick={onShowPremiumPopup}
          isPremium={isPremiumUser}
          className="mt-6"
        />
      )}
    </div>
  );
};

export default PreviewResultSection;
