
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const WelcomeMessage = () => {
  const welcomeMessage = "Let's try on what's already in your closet. I'll be here if you need a second opinion 💜";
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < welcomeMessage.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + welcomeMessage[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // Adjust speed of typing here
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, welcomeMessage]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-r from-slate-800/40 to-purple-900/40 backdrop-blur-sm p-4 rounded-lg border border-white/10 shadow-lg flex items-center gap-4"
    >
      <Avatar className="h-12 w-12 border-2 border-purple-500/30">
        <AvatarImage 
          src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" 
          alt="Olivia Bloom" 
        />
        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500">
          OB
        </AvatarFallback>
      </Avatar>
      
      <div>
        <div className="flex items-center mb-1">
          <h2 className="text-lg font-medium text-white">Olivia Bloom</h2>
          <span className="ml-2 text-xs bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded-full">
            Style Advisor
          </span>
        </div>
        
        <p className="text-white/90">
          {displayedText}
          <motion.span 
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-0.5 h-4 bg-purple-400 ml-0.5"
          >
            |
          </motion.span>
        </p>
      </div>
    </motion.div>
  );
};

export default WelcomeMessage;
