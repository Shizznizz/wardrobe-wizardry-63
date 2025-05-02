
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";

const HowItWorksSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  return (
    <motion.section
      className="py-20 px-4 bg-slate-900/50 backdrop-blur-sm relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.7 }}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-coral-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          {/* Olivia's face on the left */}
          <motion.div 
            className="w-full md:w-1/3 lg:w-1/4 flex justify-center md:justify-start"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600/20 to-coral-500/20 rounded-full blur-3xl"></div>
              <img 
                src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" 
                alt="Olivia" 
                className="w-40 h-40 object-cover rounded-full border-2 border-white/10 shadow-lg shadow-purple-500/20"
              />
            </div>
          </motion.div>
          
          {/* How it works content */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <motion.div 
              className="mb-12 flex items-center justify-center md:justify-start gap-2"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="h-6 w-6 text-coral-400" />
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-purple-400">
                How It Works
              </h2>
            </motion.div>
            
            {/* Steps - Horizontal scrolling on mobile */}
            <div 
              ref={scrollContainerRef} 
              className={`
                ${isMobile ? 'flex overflow-x-auto pb-6 snap-x snap-mandatory scroll-pl-4 space-x-6 hide-scrollbar' : 'grid grid-cols-3 gap-8'}
              `}
              style={isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}
            >
              {/* Adding global style for the scrollbar */}
              <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 768px) {
                  .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                }
              `}} />
              
              <HowItWorksStep 
                number="1"
                title="Upload Your Wardrobe"
                description="Take photos of your clothes or add items from our catalog to build your virtual wardrobe."
                delay={0.1}
                isMobile={isMobile}
              />
              
              <HowItWorksStep 
                number="2"
                title="Share Your Style Preferences"
                description="Tell Olivia about your style preferences, favorite colors, and outfits you love."
                delay={0.2}
                isMobile={isMobile}
              />
              
              <HowItWorksStep 
                number="3"
                title="Get Daily Outfit Inspirations"
                description="Receive personalized outfit suggestions based on your style, weather, and upcoming events."
                delay={0.3}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// How It Works Step component with animations
const HowItWorksStep = ({ number, title, description, delay, isMobile }: {
  number: string;
  title: string;
  description: string;
  delay: number;
  isMobile: boolean;
}) => {
  return (
    <motion.div 
      className={`flex flex-col items-center text-center ${isMobile ? 'min-w-[280px] snap-center flex-shrink-0' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-coral-500/30 to-purple-500/30 blur-md"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-coral-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mb-4 relative z-10">
          {number}
        </div>
      </motion.div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>
  );
};

export default HowItWorksSection;
