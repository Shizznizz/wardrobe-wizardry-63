
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OliviaAIRecommendationProps {
  onGenerateRecommendations: () => void;
}

const OliviaAIRecommendation = ({ onGenerateRecommendations }: OliviaAIRecommendationProps) => {
  const [hover, setHover] = useState(false);
  
  return (
    <div className="px-6 py-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-t border-b border-purple-500/20">
      <motion.div 
        className="flex items-center justify-between"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-white">Not sure about your preferences?</h4>
          <p className="text-xs text-white/70">Let Olivia analyze your style and suggest preferences that match your personality</p>
        </div>
        
        <motion.div
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          onHoverStart={() => setHover(true)}
          onHoverEnd={() => setHover(false)}
        >
          <Button 
            onClick={onGenerateRecommendations} 
            className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <motion.div 
              className="absolute inset-0 bg-white/20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: hover ? 1.2 : 0, 
                opacity: hover ? 0.2 : 0 
              }}
              transition={{ duration: 0.5 }}
              style={{ borderRadius: '50%' }}
            />
            
            <span className="relative flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              <span>Let Olivia suggest</span>
            </span>
            
            <motion.div
              className="absolute top-0 right-0 -mr-1 -mt-1"
              animate={{ 
                rotate: [0, 15, 0, -15, 0],
                scale: [1, 1.2, 1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OliviaAIRecommendation;
