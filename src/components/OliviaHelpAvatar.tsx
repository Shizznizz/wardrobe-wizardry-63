
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import OutfitTips from './outfits/OutfitTips';

interface OliviaHelpAvatarProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const OliviaHelpAvatar = ({ position = 'top-right' }: OliviaHelpAvatarProps) => {
  const [showTips, setShowTips] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  const tips = [
    {
      id: 1,
      title: "Upload Your Photo",
      content: "Start by uploading a full-body photo of yourself. This will be the base for trying on new clothes."
    },
    {
      id: 2,
      title: "Select Clothing Items",
      content: "Upload photos of clothing items you're interested in trying on. You can see how they look on you before purchasing."
    },
    {
      id: 3,
      title: "Create Complete Outfits",
      content: "After trying on your main item, add more pieces to create complete looks with accessories and layers."
    },
    {
      id: 4,
      title: "Get Styling Recommendations",
      content: "Check out the recommendations section for outfit ideas that complement your selected items."
    },
    {
      id: 5,
      title: "Save and Share",
      content: "Found the perfect look? Save it to your wardrobe or share it with friends to get their opinion!"
    }
  ];

  const getPositionClasses = () => {
    switch(position) {
      case 'top-left': return 'top-24 left-6';
      case 'bottom-right': return 'bottom-24 right-6';
      case 'bottom-left': return 'bottom-16 left-6';
      case 'top-right': return 'top-24 right-6';
      default: return 'top-24 right-6';
    }
  };

  const handleAvatarClick = () => {
    setShowTips(true);
    setCurrentTipIndex(0);
  };

  const handleClose = () => {
    setShowTips(false);
  };

  const handleNextTip = () => {
    if (currentTipIndex < tips.length - 1) {
      setCurrentTipIndex(prev => prev + 1);
    } else {
      setShowTips(false);
    }
  };

  return (
    <div className={`fixed z-50 ${getPositionClasses()}`}>
      <AnimatePresence>
        {!showTips ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative"
          >
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleAvatarClick}
                    variant="outline"
                    size="sm"
                    className="rounded-full h-12 w-12 p-0.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-md hover:shadow-purple-500/20 border-0"
                  >
                    <Avatar className="h-full w-full border-2 border-white/30">
                      <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
                    </Avatar>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-slate-900 text-white border-purple-400/30">
                  <p>Need help?</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        ) : (
          <OutfitTips 
            tips={tips}
            onShowAssistant={() => {}}
            showAssistant={false}
            onClose={handleClose}
            currentTipIndex={currentTipIndex}
            onNextTip={handleNextTip}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OliviaHelpAvatar;
