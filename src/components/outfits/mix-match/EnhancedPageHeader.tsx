
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface EnhancedPageHeaderProps {
  userName?: string | null;
  onScrollToWeather: () => void;
}

const EnhancedPageHeader = ({ userName, onScrollToWeather }: EnhancedPageHeaderProps) => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="relative py-6 md:py-8 lg:py-10 px-4 text-center"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>

      {/* Main content */}
      <motion.h1 
        variants={fadeUp}
        className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-coral-500 via-purple-400 to-indigo-400 leading-tight max-w-5xl mx-auto"
      >
        Your Daily Style, Curated by Olivia
      </motion.h1>

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
          className="text-base md:text-lg px-6 py-6 h-auto"
        >
          Let Olivia Style Me Today
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedPageHeader;
