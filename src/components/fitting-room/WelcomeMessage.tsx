
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const WelcomeMessage = () => {
  const [isTyping, setIsTyping] = useState(true);
  const message = "Let's try on what's already in your closet. I'll be here if you need a second opinion 💜";
  const [displayedMessage, setDisplayedMessage] = useState('');
  
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        if (displayedMessage.length < message.length) {
          setDisplayedMessage(message.substring(0, displayedMessage.length + 1));
        } else {
          setIsTyping(false);
        }
      }, 30);
      
      return () => clearTimeout(timer);
    }
  }, [displayedMessage, isTyping, message]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto text-center"
    >
      <div className="inline-flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
          <span className="text-white text-sm">OB</span>
        </div>
        <span className="text-sm text-purple-300">Olivia Bloom</span>
      </div>
      
      <p className="text-lg sm:text-xl text-white/90 font-light">
        {displayedMessage}
        {isTyping && <span className="ml-1 animate-pulse">|</span>}
      </p>
    </motion.div>
  );
};

export default WelcomeMessage;
