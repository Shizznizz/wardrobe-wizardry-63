
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
      
      <main className="container mx-auto px-4 pt-32 md:pt-40 pb-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-6xl mx-auto mb-16">
          {/* Left side - Text content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              The Future of Fashion
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              AI-powered personal styling that transforms your wardrobe experience
            </p>
            
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-lg shadow-lg hover:shadow-purple-700/20">
                  <Link to="/my-wardrobe">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-purple-400/30 text-white hover:bg-white/10 px-8 py-6 rounded-lg">
                  <Link to="/style-quiz">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Take Style Quiz
                  </Link>
                </Button>
              </div>
            ) : (
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-lg shadow-lg hover:shadow-purple-700/20">
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
            <div className="relative group">
              <img 
                src="/lovable-uploads/4e16d86c-652b-4717-958f-b48ce5663c9b.png"
                alt="Olivia Bloom - Your AI Stylist"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl shadow-purple-500/20 transition-transform group-hover:scale-105"
              />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-10 -left-4 bg-gradient-to-r from-purple-600/90 to-pink-600/90 p-6 rounded-2xl shadow-xl max-w-xs backdrop-blur-sm border border-white/10"
              >
                <p className="text-white text-lg font-medium">
                  Meet Olivia Bloom, your personal AI-powered stylist. Ready to help you create perfect outfits and organize your wardrobe.
                </p>
              </motion.div>
            </div>
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

