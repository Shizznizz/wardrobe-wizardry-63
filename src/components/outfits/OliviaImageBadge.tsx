
import { User } from 'lucide-react';
import { motion } from 'framer-motion';

interface OliviaImageBadgeProps {
  isVisible: boolean;
}

const OliviaImageBadge = ({ isVisible }: OliviaImageBadgeProps) => {
  if (!isVisible) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-3 left-3 bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm py-1 px-3 rounded-full flex items-center gap-1.5 z-10 border border-white/20 shadow-md"
    >
      <User className="h-3 w-3 text-white" />
      <span className="text-xs font-medium text-white">Olivia's Image</span>
    </motion.div>
  );
};

export default OliviaImageBadge;
