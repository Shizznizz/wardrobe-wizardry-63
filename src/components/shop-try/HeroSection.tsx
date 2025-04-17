
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Camera, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onStartStyling: () => void;
}

const HeroSection = ({ onStartStyling }: HeroSectionProps) => {
  return (
    <motion.div 
      className="text-center space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Try Before You Buy
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Experience virtual try-on powered by AI. See exactly how clothes will look on you before making a purchase.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Button 
          onClick={onStartStyling}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg rounded-full px-8 py-6 shadow-xl shadow-purple-900/20 hover:shadow-purple-900/40 transition-all"
          size="lg"
        >
          <Camera className="h-5 w-5 mr-2" />
          Start Your Virtual Try-On
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
        
        <div className="mt-4 text-white/60 flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-sm">Powered by advanced AI styling technology</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
