
import { motion } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';

interface TryOnLoadingAnimationProps {
  isVisible: boolean;
}

const TryOnLoadingAnimation = ({ isVisible }: TryOnLoadingAnimationProps) => {
  if (!isVisible) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
    >
      <div className="relative">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
          }}
          className="text-purple-500"
        >
          <Wand2 className="h-16 w-16" />
        </motion.div>
        
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Sparkles className="h-6 w-6 text-yellow-300" />
        </motion.div>
      </div>
      
      <motion.h3
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="mt-4 text-xl font-medium text-white"
      >
        Loading Magic...
      </motion.h3>
      
      <motion.div 
        className="mt-6 bg-white/10 rounded-full h-2 w-56 overflow-hidden"
      >
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="h-full w-20 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
        />
      </motion.div>
      
      <p className="mt-4 text-white/70 text-sm max-w-xs text-center">
        Our AI is working its fashion magic to create your perfect look
      </p>
    </motion.div>
  );
};

export default TryOnLoadingAnimation;
