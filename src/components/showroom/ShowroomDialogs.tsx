
import { AnimatePresence } from 'framer-motion';
import OliviaImageGallery from '@/components/outfits/OliviaImageGallery';
import SubscriptionPopup from '@/components/SubscriptionPopup';
import StatusBar from './StatusBar';
import OptimizedOliviaAssistant from '@/components/outfits/OptimizedOliviaAssistant';
import SummonOliviaButton from '@/components/outfits/SummonOliviaButton';
import { useOliviaAssistant } from '@/hooks/useOliviaAssistant';
import { useEffect } from 'react';

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
  const {
    assistantState,
    hideTips,
    setHideTips,
    closeAssistant,
    showOutfitRecommendation,
    summonOlivia
  } = useOliviaAssistant();
  
  // Show an assistant message when an outfit is selected
  useEffect(() => {
    if (selectedOutfit && showTips && !hideTips && userPhoto) {
      const timeoutId = setTimeout(() => {
        showOutfitRecommendation(selectedOutfit, 'current');
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedOutfit, userPhoto, showTips, hideTips, showOutfitRecommendation]);
  
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
      
      {/* Optimized Olivia Assistant */}
      <OptimizedOliviaAssistant
        show={assistantState.show}
        message={assistantState.message}
        trigger={assistantState.trigger}
        outfit={assistantState.outfit}
        onClose={closeAssistant}
        onAction={assistantState.onAction}
        actionText={assistantState.actionText}
        position="bottom"
        hideTipsPreference={hideTips}
        setHideTipsPreference={setHideTips}
      />
      
      {/* Summon Olivia Button - only show if tips are not disabled */}
      {showTips && (
        <SummonOliviaButton
          position="bottom-right"
          onSummon={summonOlivia}
          tooltip="Get style advice from Olivia"
        />
      )}
    </>
  );
};

export default ShowroomDialogs;
