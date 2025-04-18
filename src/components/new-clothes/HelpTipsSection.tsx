
import { useState } from 'react';
import OutfitTips, { defaultOutfitTips } from '@/components/outfits/OutfitTips';

interface HelpTipsSectionProps {
  showHelpTips: boolean;
  onShowHelpTips: (show: boolean) => void;
  currentTipIndex: number;
  onNextTip: () => void;
}

const HelpTipsSection = ({
  showHelpTips,
  onShowHelpTips,
  currentTipIndex,
  onNextTip
}: HelpTipsSectionProps) => {
  return (
    <>
      {showHelpTips && (
        <div className="fixed top-36 right-4 z-40">
          <OutfitTips 
            tips={defaultOutfitTips}
            onShowAssistant={() => {}}
            showAssistant={false}
            onClose={() => {
              onShowHelpTips(false);
            }}
            currentTipIndex={currentTipIndex}
            onNextTip={onNextTip}
          />
        </div>
      )}
    </>
  );
};

export default HelpTipsSection;
