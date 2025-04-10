
import { motion } from 'framer-motion';
import { X, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export interface OutfitTip {
  id: number;
  title: string;
  content: string;
}

interface OutfitTipsProps {
  tips: OutfitTip[];
  onShowAssistant: () => void;
  showAssistant: boolean;
  onClose: () => void;
  currentTipIndex: number;
  onNextTip: () => void;
}

// Define and export the default outfit tips
export const defaultOutfitTips: OutfitTip[] = [
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

const OutfitTips = ({
  tips,
  onShowAssistant,
  showAssistant,
  onClose,
  currentTipIndex,
  onNextTip
}: OutfitTipsProps) => {
  const currentTip = tips[currentTipIndex];
  const isLastTip = currentTipIndex === tips.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 rounded-xl shadow-xl max-w-xs relative"
    >
      <button
        onClick={onClose}
        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
      >
        <X className="h-4 w-4 text-purple-600" />
      </button>
      
      <div className="flex items-start space-x-3 mb-3">
        <Avatar className="h-10 w-10 border-2 border-white">
          <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
          <AvatarFallback>OB</AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="text-white font-medium">Olivia's Tip #{currentTipIndex + 1}</h3>
          <p className="text-white/80 text-sm">{currentTip.title}</p>
        </div>
      </div>
      
      <p className="text-white text-sm mb-4">
        {currentTip.content}
      </p>
      
      <div className="flex justify-between items-center">
        {isLastTip ? (
          <Button 
            onClick={onShowAssistant}
            variant="secondary" 
            size="sm"
            className="text-xs"
            disabled={showAssistant}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Chat with Olivia
          </Button>
        ) : (
          <Button onClick={onNextTip} variant="secondary" size="sm" className="text-xs">
            Next Tip
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default OutfitTips;
