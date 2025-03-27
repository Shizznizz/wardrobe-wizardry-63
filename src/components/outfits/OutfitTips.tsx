
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface OutfitTip {
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

// Default tips we'll use for the Olivia help avatar
export const defaultOutfitTips: OutfitTip[] = [
  {
    id: 1,
    title: "Welcome to Virtual Try-On!",
    content: "Upload your photo or use one of mine to see how different clothing items will look on you before making a purchase."
  },
  {
    id: 2,
    title: "Using Olivia's Images",
    content: "Click the 'Use Image of Olivia Bloom' button to select from my professional model photos if you don't want to upload your own."
  },
  {
    id: 3,
    title: "Try Different Outfits",
    content: "After selecting a model image, choose clothing items to visualize how they'd look. Mix and match to create perfect outfits!"
  },
  {
    id: 4,
    title: "Save Your Favorites",
    content: "Like what you see? Save your favorite virtual try-on looks to reference later or share with friends."
  },
  {
    id: 5,
    title: "Upgrade for More",
    content: "Premium users can access exclusive clothing collections and advanced styling tools for the perfect virtual try-on experience."
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
  const isLastTip = currentTipIndex === tips.length - 1;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="max-w-xs"
    >
      <Card className="glass-dark border-white/10 overflow-hidden relative group backdrop-blur-md bg-slate-900/90 shadow-lg">
        <CardContent className="p-6">
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4 text-white/80" />
          </button>
          
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-10 w-10 border-2 border-purple-400/30">
              <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-base font-semibold flex items-center">
                Olivia Bloom
                <Sparkles className="h-3 w-3 ml-2 text-yellow-300" />
              </h3>
              <p className="text-white/70 text-xs">Fashion Assistant</p>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4"
            >
              <h4 className="text-sm font-medium mb-1 text-white">{tips[currentTipIndex].title}</h4>
              <p className="text-sm text-white/90">{tips[currentTipIndex].content}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/60">
              Tip {currentTipIndex + 1}/{tips.length}
            </span>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="sm"
                onClick={onNextTip}
                className="text-xs border-purple-400/30 text-white hover:bg-white/10 transition-all duration-300 hover:border-purple-400/50"
              >
                {isLastTip ? "Close" : "Next Tip"}
                {!isLastTip && <ArrowRight className="ml-1 h-3 w-3" />}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OutfitTips;
