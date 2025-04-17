
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface FloatingOliviaWidgetProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
  onOpenChat: () => void;
}

const tips = [
  {
    id: 1,
    title: "Upload Your Photo",
    content: "Start by uploading a full-body photo of yourself to try on new clothes."
  },
  {
    id: 2,
    title: "Browse Styles",
    content: "Explore trending pieces and select items you'd like to try on virtually."
  },
  {
    id: 3,
    title: "Get Instant Preview",
    content: "See how the clothes look on you instantly with our AI technology."
  }
];

const FloatingOliviaWidget = ({ 
  isPremiumUser, 
  onUpgradeToPremium,
  onOpenChat 
}: FloatingOliviaWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showingTips, setShowingTips] = useState(true);
  
  const currentTip = tips[currentTipIndex];
  const isLastTip = currentTipIndex === tips.length - 1;
  
  const handleNextTip = () => {
    if (currentTipIndex < tips.length - 1) {
      setCurrentTipIndex(prev => prev + 1);
    } else {
      setShowingTips(false);
    }
  };
  
  const handleChatClick = () => {
    if (isPremiumUser) {
      onOpenChat();
    } else {
      onUpgradeToPremium();
    }
    setIsOpen(false);
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-xs">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-lg p-4 rounded-lg border border-purple-500/30 shadow-xl mb-4 w-full max-w-xs mx-auto"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="font-medium text-white">Olivia's Styling Guide</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-slate-400 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {showingTips ? (
                <>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-white">{currentTip.title}</h3>
                    <p className="text-sm text-slate-300">{currentTip.content}</p>
                  </div>
                  
                  <Button 
                    onClick={handleNextTip}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500"
                    size="sm"
                  >
                    {isLastTip ? "Start Chatting" : "Next Tip"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-300">
                    Ready to get personalized styling advice?
                  </p>
                  
                  <Button 
                    onClick={handleChatClick}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {isPremiumUser ? "Chat with Olivia" : "Upgrade for Advice"}
                  </Button>
                  
                  {!isPremiumUser && (
                    <p className="text-xs text-slate-400 text-center mt-1">
                      Premium feature: Get personalized styling advice
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-3 shadow-lg shadow-purple-500/20 flex items-center justify-center relative ml-auto"
            >
              <MessageCircle className="h-6 w-6 text-white" />
              {!isOpen && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {showingTips ? currentTipIndex + 1 : '!'}
                </span>
              )}
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Need help from Olivia?</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FloatingOliviaWidget;
