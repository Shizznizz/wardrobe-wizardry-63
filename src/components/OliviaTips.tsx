import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, MinusCircle, PlusCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Party } from '@/components/ui/icons';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { useIsMobile } from '@/hooks/use-mobile';

interface OliviaTipsProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const OliviaTips = ({ position = 'top-right' }: OliviaTipsProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [hasCompletedTips, setHasCompletedTips] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasScrolledTrigger, setHasScrolledTrigger] = useState(false);
  const isMobile = useIsMobile();
  
  const tips = [
    {
      title: "Build Your Digital Wardrobe",
      message: "Take a moment to add all your clothes. The more complete your wardrobe is, the smarter I can help with outfit ideas, suggestions, and style advice.",
      icon: <Sparkles className="h-4 w-4 text-amber-300" />,
    },
    {
      title: "One-Time Setup, Ongoing Ease",
      message: "Adding your items might take a little time now, but once it's done, it's easy to maintain. Just add new clothes when you buy them.",
      icon: <Party className="h-4 w-4 text-emerald-300" />,
    },
    {
      title: "Unlock the Power of Mix & Match",
      message: "Once your wardrobe is complete, head to the Mix & Match page. I'll suggest personalized outfits based on your style, the weather, and the occasion.",
      icon: <MessageCircle className="h-4 w-4 text-blue-300" />,
    }
  ];

  useEffect(() => {
    const storedProgress = localStorage.getItem('oliviaTipsProgress');
    if (storedProgress) {
      const { index, completed } = JSON.parse(storedProgress);
      setCurrentTipIndex(index);
      setHasCompletedTips(completed);
    }
    
    if (!localStorage.getItem('oliviaTipsShown')) {
      const handleScroll = () => {
        if (!hasScrolledTrigger) {
          const scrollPosition = window.scrollY;
          const pageHeight = document.body.scrollHeight;
          const triggerPoint = pageHeight * 0.3;
          
          if (scrollPosition > triggerPoint) {
            setShowTips(true);
            setHasScrolledTrigger(true);
            window.removeEventListener('scroll', handleScroll);
          }
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [hasScrolledTrigger]);

  useEffect(() => {
    localStorage.setItem('oliviaTipsProgress', JSON.stringify({
      index: currentTipIndex,
      completed: hasCompletedTips
    }));
  }, [currentTipIndex, hasCompletedTips]);

  const getPositionClasses = () => {
    if (isMobile && position === 'top-right') {
      return 'top-36 right-6';
    }
    
    switch(position) {
      case 'top-left': return 'top-24 left-6';
      case 'bottom-right': return 'bottom-24 right-6';
      case 'bottom-left': return 'bottom-16 left-6';
      case 'top-right': return 'top-28 right-6';
      default: return 'top-28 right-6';
    }
  };

  const handleGotIt = () => {
    if (currentTipIndex === tips.length - 1) {
      setShowTips(false);
      setHasCompletedTips(true);
      localStorage.setItem('oliviaTipsShown', 'true');
    } else {
      setCurrentTipIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleNextTip = () => {
    if (currentTipIndex < tips.length - 1) {
      setCurrentTipIndex(prevIndex => prevIndex + 1);
    } else {
      setShowTips(false);
      setHasCompletedTips(true);
      localStorage.setItem('oliviaTipsShown', 'true');
    }
  };

  const handleClose = () => {
    setShowTips(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleAvatarClick = () => {
    if (hasCompletedTips) {
      const storedProgress = localStorage.getItem('oliviaTipsProgress');
      if (storedProgress) {
        const { completed } = JSON.parse(storedProgress);
        if (completed) {
          if (confirm("Would you like to continue the tips from where you left off?")) {
            setHasCompletedTips(false);
            setShowTips(true);
          }
        }
      }
      return;
    }
    setShowTips(true);
  };

  if (!isVisible) return null;

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
            <HoverCard openDelay={300} closeDelay={200}>
              <HoverCardTrigger asChild>
                <button
                  onClick={handleAvatarClick}
                  className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 p-0.5 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                >
                  <div className="h-full w-full rounded-full overflow-hidden border-2 border-white/30">
                    <Avatar className="h-full w-full">
                      <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
                    </Avatar>
                  </div>
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-48 bg-slate-900/90 border-white/10 text-white shadow-lg shadow-purple-500/10 backdrop-blur-md">
                <p className="text-sm font-medium text-center">Need style advice?</p>
              </HoverCardContent>
            </HoverCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="max-w-xs"
          >
            <div className="relative p-5 rounded-xl bg-slate-900/90 text-white backdrop-blur-sm shadow-lg shadow-black/20 border border-white/20">
              <div className="absolute top-2 right-2 flex space-x-1">
                <button 
                  onClick={handleMinimize} 
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  {isMinimized ? 
                    <PlusCircle className="h-4 w-4 text-white/80" /> :
                    <MinusCircle className="h-4 w-4 text-white/80" />
                  }
                </button>
                <button 
                  onClick={handleClose} 
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4 text-white/80" />
                </button>
              </div>
              
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border-2 border-white/30 shadow-md">
                  <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-white text-sm">Olivia Bloom</h4>
                    {tips[currentTipIndex].icon}
                    <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                      Tip {currentTipIndex + 1}/{tips.length}
                    </span>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {!isMinimized && (
                      <motion.div
                        key={currentTipIndex}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-3"
                      >
                        <h5 className="text-sm font-medium mb-1">{tips[currentTipIndex].title}</h5>
                        <p className="text-sm text-white/90">{tips[currentTipIndex].message}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {!isMinimized && (
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleGotIt}
                        className="text-xs h-8 bg-white/10 border-white/10 hover:bg-white/20 hover:text-white text-white/90"
                      >
                        Got it!
                      </Button>
                      
                      {currentTipIndex < tips.length - 1 && (
                        <Button 
                          size="sm" 
                          onClick={handleNextTip}
                          className="text-xs h-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          Next Tip
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OliviaTips;
