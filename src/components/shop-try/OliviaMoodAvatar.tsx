
import { motion } from 'framer-motion';
import { Heart, Smile, HelpCircle } from 'lucide-react';

interface OliviaMoodAvatarProps {
  mood: 'happy' | 'neutral' | 'thinking';
}

const OliviaMoodAvatar = ({ mood }: OliviaMoodAvatarProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        delay: 0.5 
      }}
      className="absolute bottom-6 right-6 z-10"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-1">
          <div className="w-full h-full rounded-full overflow-hidden">
            <img 
              src="/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png" 
              alt="Olivia" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {mood === 'happy' && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.8 }}
            className="absolute -top-2 -right-2 bg-white rounded-full p-1"
          >
            <Heart className="h-5 w-5 text-pink-500" fill="#ec4899" />
          </motion.div>
        )}
        
        {mood === 'neutral' && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.8 }}
            className="absolute -top-2 -right-2 bg-white rounded-full p-1"
          >
            <Smile className="h-5 w-5 text-amber-500" />
          </motion.div>
        )}
        
        {mood === 'thinking' && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.8 }}
            className="absolute -top-2 -right-2 bg-white rounded-full p-1"
          >
            <HelpCircle className="h-5 w-5 text-blue-500" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default OliviaMoodAvatar;
