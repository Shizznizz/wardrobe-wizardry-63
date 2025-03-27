
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
      <div className="fixed top-20 right-4 z-50">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
          onClick={() => onShowHelpTips(true)}
        >
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-purple-400/30 shadow-lg hover:border-purple-400/60 transition-all duration-300">
              <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-[10px] rounded-full px-1.5 py-0.5 border border-white">
              ?
            </div>
          </div>
          <p className="text-xs text-center mt-1 text-white/70">Need help?</p>
        </motion.div>
      </div>
      
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
