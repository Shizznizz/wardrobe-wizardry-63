
import { User, Heart, BrainCircuit, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

interface OliviaMoodAvatarProps {
  mood: 'happy' | 'thinking' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

const OliviaMoodAvatar = ({ mood, size = 'md' }: OliviaMoodAvatarProps) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };
  
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-8 h-8';
      default: return 'w-6 h-6';
    }
  };
  
  const renderMoodIcon = () => {
    switch (mood) {
      case 'happy':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute -right-1 -bottom-1 bg-pink-500 rounded-full p-1"
          >
            <Heart className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
          </motion.div>
        );
      case 'thinking':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute -right-1 -bottom-1 bg-amber-500 rounded-full p-1"
          >
            <BrainCircuit className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
          </motion.div>
        );
      default:
        return null;
    }
  };
  
  return (
    <motion.div 
      className={`${getSizeClass()} relative`}
      whileHover={{ scale: 1.1 }}
    >
      <div className={`${getSizeClass()} rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center`}>
        {mood === 'happy' ? (
          <Smile className={`${getIconSize()} text-white`} />
        ) : (
          <User className={`${getIconSize()} text-white`} />
        )}
      </div>
      {renderMoodIcon()}
    </motion.div>
  );
};

export default OliviaMoodAvatar;
