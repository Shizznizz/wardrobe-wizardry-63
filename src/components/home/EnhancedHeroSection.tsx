
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EnhancedHeroSectionProps {
  onStartJourney: () => void;
  onTakeStyleQuiz: () => void;
}

const EnhancedHeroSection: React.FC<EnhancedHeroSectionProps> = ({ 
  onStartJourney, 
  onTakeStyleQuiz 
}) => {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-purple-600/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-coral-600/20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left side - Text content */}
          <motion.div 
            className="w-full md:w-1/2 md:pr-8 text-left space-y-6 z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative flex items-start">
              <motion.div 
                className="absolute -left-6 -top-4"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Sparkles className="w-5 h-5 text-coral-400 animate-pulse" />
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-purple-400 leading-tight">
                The Future of Fashion
              </h1>
            </div>
            
            <p className="text-xl text-white/80">
              Trusted by 10,000+ style-conscious women.
            </p>
            
            <div className="space-y-4">
              <p className="text-white/70 text-lg">
                Say goodbye to style stress. Olivia curates outfits that match your vibe, wardrobe, and the weather.
              </p>
              <p className="text-white/70 text-lg">
                With Olivia, your AI stylist, you'll get personalized outfit ideas that feel just right — every single day.
              </p>
            </div>
            
            <motion.div 
              className="flex flex-wrap gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Button 
                onClick={onStartJourney}
                className="bg-gradient-to-r from-[#ff4ecb] to-[#a97eff] text-white hover:scale-[1.03] transition-all duration-300 font-bold py-6 px-8 rounded-xl shadow-md h-auto text-lg flex items-center gap-2 group"
              >
                Start Your Style Journey
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              
              <Button 
                onClick={onTakeStyleQuiz}
                className="bg-gradient-to-r from-[#44337a]/30 to-[#702459]/30 backdrop-blur-sm border border-white/10 text-white hover:scale-[1.03] hover:border-white/20 transition-all duration-300 font-bold py-6 px-8 rounded-xl shadow-md h-auto text-lg"
              >
                Take a Style Quiz
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 text-white/80 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Sparkles className="h-4 w-4 text-coral-400" />
              <p>Olivia styles your day in seconds. Let's go!</p>
            </motion.div>
          </motion.div>
          
          {/* Right side - Olivia image */}
          <motion.div 
            className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center items-center relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {/* Soft glow behind Olivia */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-coral-500/20 rounded-full blur-3xl"></div>
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 5,
                ease: "easeInOut" 
              }}
              className="relative z-10"
            >
              <img 
                src="/lovable-uploads/117f17c5-142c-43a5-88dd-5fb06adbbe27.png" 
                alt="Olivia - Your AI Fashion Assistant" 
                className="max-h-[550px] drop-shadow-2xl"
              />
              
              {/* Micro sparkles around Olivia */}
              <motion.div 
                className="absolute top-1/4 -left-5"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3
                }}
              >
                <Sparkles className="w-4 h-4 text-coral-300/80" />
              </motion.div>
              
              <motion.div 
                className="absolute bottom-1/4 -right-3"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 4,
                  delay: 1
                }}
              >
                <Sparkles className="w-4 h-4 text-purple-300/80" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
