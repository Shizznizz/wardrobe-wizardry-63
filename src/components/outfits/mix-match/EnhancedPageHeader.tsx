
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface EnhancedPageHeaderProps {
  userName?: string | null;
  onScrollToWeather: () => void;
}

const EnhancedPageHeader = ({ userName, onScrollToWeather }: EnhancedPageHeaderProps) => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  const sparkleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 0.8,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="relative py-6 md:py-8 lg:py-10 px-4 text-center"
    >
      {/* Add a style tag for custom CSS */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .enhanced-header-sparkle {
            top: -15px !important;
            left: 20% !important;
          }
        }
      `}</style>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl"></div>
        
        {/* Additional futuristic elements */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
        <div className="absolute -left-20 top-1/4 w-40 h-40 rounded-full border border-pink-300/20"></div>
        <div className="absolute right-10 bottom-1/4 w-20 h-20 rounded-full border border-indigo-300/20"></div>
      </div>

      {/* Main content */}
      <motion.div className="relative">
        <motion.div
          className="absolute -top-6 left-1/4 enhanced-header-sparkle"
          variants={sparkleVariants}
          initial="initial"
          animate="animate"
        >
          <Sparkles className="w-5 h-5 text-pink-400" />
        </motion.div>
        <motion.h1 
          variants={fadeUp}
          className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-coral-500 via-purple-400 to-indigo-400 leading-tight max-w-5xl mx-auto"
        >
          Your Daily Style, Curated by Olivia
        </motion.h1>
      </motion.div>

      <motion.p 
        variants={fadeUp} 
        className="text-base xs:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed"
      >
        {userName 
          ? `Hi ${userName}, get AI-powered outfits based on your style, mood, and local weather.`
          : `Get AI-powered outfits based on your style, mood, and local weather.`
        }
      </motion.p>

      <motion.div 
        variants={fadeUp}
        className="flex flex-col items-center justify-center"
      >
        <Button 
          variant="hero-primary"
          size="lg"
          onClick={onScrollToWeather}
          className="text-base md:text-lg px-6 py-6 h-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-95 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 transition-all duration-300"
        >
          Let Olivia Style Me Today
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedPageHeader;
