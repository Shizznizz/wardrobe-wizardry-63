
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

const styleTips = [
  "Warm weather? Light layers and open shoes 👡 will keep it breezy & chic!",
  "When in doubt, add a bold accessory! 💄✨",
  "Monochrome outfits instantly look put-together with minimal effort ⚫️⚪️",
  "Silk scarves turn basic tops into statement pieces 🧣",
  "Invest in quality basics — they're the foundation of every great outfit 👕"
];

const StyleTip = () => {
  const [currentTip, setCurrentTip] = useState('');
  const [tipIndex, setTipIndex] = useState(0);
  const isMobile = useIsMobile();
  
  // Don't render on mobile
  if (isMobile) return null;
  
  useEffect(() => {
    // Set initial tip
    setCurrentTip(styleTips[tipIndex]);
    
    // Rotate tips every 20 seconds
    const interval = setInterval(() => {
      const nextIndex = (tipIndex + 1) % styleTips.length;
      setTipIndex(nextIndex);
      setCurrentTip(styleTips[nextIndex]);
    }, 20000);
    
    return () => clearInterval(interval);
  }, [tipIndex]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20"
    >
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Sparkles className="h-5 w-5 mr-2 text-yellow-300" />
        Style Tip of the Day
      </h2>
      
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 border-2 border-white/70 shadow-md flex-shrink-0">
          <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
        </Avatar>
        
        <div className="text-purple-100 relative">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentTip}
            <motion.span
              className="inline-block ml-1"
              animate={{ 
                y: [0, -4, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              ✨
            </motion.span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StyleTip;
