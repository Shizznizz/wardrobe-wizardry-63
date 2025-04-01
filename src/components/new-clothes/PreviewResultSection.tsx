
import { Outfit, ClothingItem } from '@/lib/types';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import AdditionalItemsSelector from '@/components/outfits/AdditionalItemsSelector';
import OutfitPreviewSection from '@/components/showroom/OutfitPreviewSection';

interface PreviewResultSectionProps {
  finalImage: string | null;
  outfit: Outfit | null;
  clothingItems: ClothingItem[];
  isProcessing: boolean;
  userPhoto: string | null;
  clothingPhoto?: string | null;
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
  clothingPhoto,
  isOliviaImage,
  isPremiumUser,
  onSaveLook,
  onAddItem,
  onShowPremiumPopup
}: PreviewResultSectionProps) => {
  // If we are on the new-clothes page, use OutfitPreviewSection
  if (window.location.pathname.includes('new-clothes') && userPhoto) {
    return (
      <div className="space-y-4">
        <OutfitPreviewSection
          finalImage={finalImage}
          selectedOutfit={outfit}
          clothingItems={clothingItems}
          isProcessingTryOn={isProcessing}
          userPhoto={userPhoto}
          clothingPhoto={clothingPhoto}
          isUsingOliviaImage={isOliviaImage}
          onSaveLook={onSaveLook}
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
  }
  
  // Default view for other pages
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
