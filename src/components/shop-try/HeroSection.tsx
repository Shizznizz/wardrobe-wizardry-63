
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onStartStyling: () => void;
}

const HeroSection = ({ onStartStyling }: HeroSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-8 relative overflow-hidden"
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 10, 0], 
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-40 h-40 bg-pink-600/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -15, 0], 
            y: [0, 15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity, 
            repeatType: "reverse",
            delay: 0.5
          }}
        />
      </div>

      <motion.h1 
        className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Style It Your Way
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-white/80 mx-auto max-w-3xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Upload a photo or use Olivia to try on trending fashion pieces from the internet.
        See how they'll look on you before you buy.
      </motion.p>
      
      <motion.div 
        className="relative flex items-center justify-center mb-8 md:mb-12 py-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/10 shadow-xl">
          <img 
            src="/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png" 
            alt="Olivia" 
            className="w-full h-full object-cover"
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </div>
        <motion.div 
          className="absolute top-1 right-1/4 bg-white/90 text-purple-900 rounded-full px-3 py-1 text-sm font-medium shadow-xl"
          initial={{ opacity: 0, y: 20, rotate: -5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          Hey there! 👋
        </motion.div>
        <motion.div 
          className="absolute -bottom-2 left-1/3 bg-purple-600 text-white rounded-full px-3 py-1 text-sm font-medium shadow-xl"
          initial={{ opacity: 0, y: -20, rotate: 5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          Let's style you!
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button 
          onClick={onStartStyling}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white py-6 px-8 text-lg rounded-lg shadow-lg shadow-purple-500/20 group relative overflow-hidden"
          size="lg"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <Sparkles className="mr-2 h-5 w-5 text-yellow-200 animate-pulse" />
          <span>Start Styling with Olivia</span>
        </Button>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
