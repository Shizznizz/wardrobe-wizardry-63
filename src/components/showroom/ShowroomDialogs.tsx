
import { AnimatePresence } from 'framer-motion';
import OliviaImageGallery from '@/components/outfits/OliviaImageGallery';
import SubscriptionPopup from '@/components/SubscriptionPopup';
import OliviaTips from '@/components/OliviaTips';
import StatusBar from './StatusBar';

interface ShowroomDialogsProps {
  showStatusBar: boolean;
  userPhoto: string | null;
  selectedOutfit: any | null;
  oliviaSuggestion: string;
  finalImage: string | null;
  isMobile: boolean;
  showOliviaImageGallery: boolean;
  showSubscriptionPopup: boolean;
  showTips: boolean;
  onResetSelection: () => void;
  onPreviewNow: () => void;
  onCloseOliviaImageGallery: () => void;
  onCloseSubscriptionPopup: () => void;
  onSelectOliviaImage: (imageSrc: string) => void;
  onUpgradeToPremium: () => void;
}

const ShowroomDialogs = ({
  showStatusBar,
  userPhoto,
  selectedOutfit,
  oliviaSuggestion,
  finalImage,
  isMobile,
  showOliviaImageGallery,
  showSubscriptionPopup,
  showTips,
  onResetSelection,
  onPreviewNow,
  onCloseOliviaImageGallery,
  onCloseSubscriptionPopup,
  onSelectOliviaImage,
  onUpgradeToPremium
}: ShowroomDialogsProps) => {
  return (
    <>
      <AnimatePresence>
        {showStatusBar && (
          <StatusBar 
            userPhoto={userPhoto}
            selectedOutfit={selectedOutfit}
            oliviaSuggestion={oliviaSuggestion}
            onReset={onResetSelection}
            onPreviewNow={onPreviewNow}
            isMobile={isMobile}
            finalImage={finalImage}
          />
        )}
      </AnimatePresence>
      
      <OliviaImageGallery 
        isOpen={showOliviaImageGallery}
        onClose={onCloseOliviaImageGallery}
        onSelectImage={onSelectOliviaImage}
      />
      
      <SubscriptionPopup 
        isOpen={showSubscriptionPopup}
        onClose={onCloseSubscriptionPopup}
        onUpgrade={onUpgradeToPremium}
      />
      
      {showTips && (
        <OliviaTips position="bottom-right" />
      )}
    </>
  );
};

export default ShowroomDialogs;
