
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 md:py-24 lg:py-28 bg-gradient-to-b from-[#1d0034] to-[#2c0055] text-center">
      <motion.div 
        className="container mx-auto px-4 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-wider leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-pink-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ letterSpacing: '1.5px', lineHeight: '1.2' }}
        >
          <span className="block">The Future</span>
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">of Fashion</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full blur-xl"></div>
          <Avatar className="w-28 h-28 md:w-32 md:h-32 border-2 border-[#ff66cc] shadow-lg shadow-pink-500/20">
            <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
            <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
          </Avatar>
        </motion.div>
        
        <motion.h3 
          className="text-lg md:text-xl lg:text-2xl font-semibold text-[#ffb3ec] mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ lineHeight: '1.5' }}
        >
          Say goodbye to style stress. Olivia curates outfits that match your vibe, wardrobe, and the weather.
        </motion.h3>
        
        <motion.p 
          className="text-[#e0d8f9] max-w-md md:max-w-lg mb-8 text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ lineHeight: '1.5' }}
        >
          With Olivia, your AI stylist, you'll get personalized outfit ideas that feel just right — every single day.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button 
            onClick={() => navigate('/my-wardrobe')}
            className="bg-gradient-to-r from-[#ff66cc] to-[#ff3366] hover:opacity-90 text-white px-6 py-6 rounded-lg font-semibold group"
          >
            Start Your Style Journey
            <ArrowRight className="ml-2 h-5 w-5 duration-300 group-hover:translate-x-1" />
          </Button>
          
          <Button 
            onClick={() => navigate('/quizzes')}
            variant="outline" 
            className="bg-black border-black text-white hover:bg-black/80 px-6 py-6 rounded-lg font-semibold"
          >
            Take a Style Quiz
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
