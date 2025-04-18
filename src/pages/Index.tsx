
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BackgroundShapes from '@/components/BackgroundShapes';
import SectionDivider from '@/components/SectionDivider';
import HowItWorks from '@/components/HowItWorks';
import VerticalStepCards from '@/components/VerticalStepCards';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import StyleDiscoveryQuiz from '@/components/StyleDiscoveryQuiz';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      <BackgroundShapes />
      
      <main className="container mx-auto px-4 pt-20 md:pt-28 pb-20 relative z-10">
        {/* Title Section */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold text-center mb-16 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 relative"
          style={{
            textShadow: '0 0 40px rgba(167, 139, 250, 0.3)',
            animation: 'pulse 3s infinite'
          }}
        >
          The Future of Fashion
        </motion.h1>
        
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 max-w-6xl mx-auto">
          {/* Left side - Text content and CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-6"
          >
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              AI-powered personal styling that transforms your wardrobe experience
            </p>
            
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-6 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px]"
                >
                  <Link to="/my-wardrobe">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="border-purple-400/30 text-white hover:bg-white/10 px-8 py-6 rounded-lg transition-all duration-300 hover:border-purple-400/50 hover:shadow-purple-500/20 transform hover:scale-105"
                >
                  <Link to="/style-quiz">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Take Style Quiz
                  </Link>
                </Button>
              </div>
            ) : (
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-6 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px]"
              >
                <Link to="/auth">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </motion.div>
          
          {/* Right side - Olivia's introduction */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 relative"
          >
            <motion.div 
              className="relative group"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <img 
                src="/lovable-uploads/4e16d86c-652b-4717-958f-b48ce5663c9b.png"
                alt="Olivia Bloom - Your AI Stylist"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl shadow-purple-500/20 transition-transform group-hover:scale-[1.02] duration-300"
              />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute md:-bottom-6 -bottom-24 md:-left-6 left-0 bg-gradient-to-r from-purple-600/90 to-pink-600/90 p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-purple-500/30 md:max-w-[90%] w-full md:w-auto"
                style={{
                  boxShadow: '0 8px 32px -4px rgba(147, 51, 234, 0.3)'
                }}
              >
                <p className="text-white text-lg font-medium">
                  Meet Olivia Bloom, your personal AI-powered stylist. Ready to help you create perfect outfits and organize your wardrobe.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        <HowItWorks />
        
        <SectionDivider />
        
        {user && <StyleDiscoveryQuiz />}
        
        <VerticalStepCards />
        
        <SectionDivider />
        
        <TestimonialsCarousel />
      </main>
    </div>
  );
};

export default Index;

