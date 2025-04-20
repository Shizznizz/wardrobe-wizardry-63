import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BackgroundShapes from '@/components/BackgroundShapes';
import SectionDivider from '@/components/SectionDivider';
import HowItWorks from '@/components/HowItWorks';
import VerticalFeatureTimeline from '@/components/VerticalFeatureTimeline';
import InsightsCarousel from '@/components/InsightsCarousel';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import StyleDiscoveryQuiz from '@/components/StyleDiscoveryQuiz';
import OliviaStyleAdvice from '@/components/OliviaStyleAdvice';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import HomepagePremiumTeaser from '@/components/HomepagePremiumTeaser';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();
  const [showOliviaAssistant, setShowOliviaAssistant] = useState(false);
  
  // Display Olivia assistant with a slight delay after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOliviaAssistant(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden">
      <Header />
      <BackgroundShapes />
      
      <main className="container mx-auto px-4 pt-20 md:pt-28 pb-20 relative z-10">
        {/* Hero Section with improved layout and messaging */}
        <motion.div 
          className="max-w-6xl mx-auto relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-center mb-8 md:mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 relative"
            style={{
              textShadow: '0 0 40px rgba(167, 139, 250, 0.3)',
              animation: 'pulse 3s infinite'
            }}
          >
            Transform Your Style Journey
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl md:text-2xl text-center text-blue-100 mb-12 max-w-3xl mx-auto"
          >
            Discover your unique style identity with Olivia Bloom, your personal AI stylist who understands exactly what makes you shine.
          </motion.p>
          
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 max-w-6xl mx-auto mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex-1 space-y-8 order-2 md:order-1"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm">
                    <Sparkles className="h-5 w-5 text-purple-300" />
                  </div>
                  <h3 className="text-xl font-medium text-white">AI-Powered Style Insights</h3>
                </div>
                <p className="text-white/80 pl-10">
                  Personalized recommendations based on your body type, preferences, and current wardrobe to create endless perfect outfits.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-blue-600/30 to-cyan-600/30 backdrop-blur-sm">
                    <Zap className="h-5 w-5 text-blue-300" />
                  </div>
                  <h3 className="text-xl font-medium text-white">Virtual Try-On Experience</h3>
                </div>
                <p className="text-white/80 pl-10">
                  See outfits on your body before purchasing. No more guesswork or disappointing online shopping experiences.
                </p>
              </div>
              
              {user ? (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] font-medium"
                  >
                    <Link to="/my-wardrobe" className="flex items-center">
                      Start Styling
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    size="lg" 
                    variant="outline" 
                    className="border-purple-400/30 text-white hover:bg-white/10 px-8 py-6 rounded-xl transition-all duration-300 hover:border-purple-400/50 hover:shadow-purple-500/20 transform hover:scale-105 font-medium"
                  >
                    <Link to="/style-quiz" className="flex items-center">
                      <Star className="mr-2 h-5 w-5" />
                      Take Style Quiz
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] mt-6 font-medium"
                >
                  <Link to="/auth" className="flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex-1 relative order-1 md:order-2"
            >
              <motion.div 
                className="relative group"
                animate={{ 
                  y: [0, -10, 0] 
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                <img 
                  src="/lovable-uploads/4e16d86c-652b-4717-958f-b48ce5663c9b.png"
                  alt="Olivia Bloom - Your AI Stylist"
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl shadow-purple-500/20 transition-transform relative z-10 bg-slate-900/50 backdrop-blur-sm border border-white/10"
                />
                
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.6,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  className="absolute -bottom-8 right-0 md:-right-8 max-w-xs transform rotate-2 z-20"
                >
                  <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 p-6 rounded-xl shadow-xl backdrop-blur-sm border border-white/20 text-white">
                    <p className="text-lg font-medium">
                      Hi! I'm Olivia Bloom, your personal AI style advisor. Let me help you look and feel amazing!
                    </p>
                    <div className="w-4 h-4 bg-pink-600 absolute -bottom-2 right-12 rotate-45"></div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        
        <SectionDivider variant="gradient" />
      
        {/* Fresh Look CTA Section */}
        <motion.div 
          className="max-w-6xl mx-auto py-20 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="flex-1 relative">
              <motion.img 
                src="/lovable-uploads/4e16d86c-652b-4717-958f-b48ce5663c9b.png"
                alt="Olivia Bloom - Your AI Stylist"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full filter blur-xl"></div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Ready to discover a fresh look?
              </motion.h2>
              <motion.p 
                className="text-xl text-white/80 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Let's find the perfect outfit that matches your vibe today!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  asChild
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-6 rounded-xl h-auto text-lg font-medium shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <Link to={user ? "/my-wardrobe" : "/auth"} className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <InsightsCarousel />
      
        <SectionDivider variant="dotted" />
        
        <VerticalFeatureTimeline />
        
        <SectionDivider />
        
        <OliviaStyleAdvice className="mt-16 mb-24" />
        
        <HomepagePremiumTeaser />
        
        <SectionDivider />
        
        <HowItWorks />
        
        <SectionDivider />
        
        <TestimonialsCarousel />
        
        {user && <StyleDiscoveryQuiz />}
      </main>
      
      {/* Animated Olivia Assistant */}
      <AnimatePresence>
        {showOliviaAssistant && (
          <OliviaBloomAssistant 
            message="Need help finding your perfect style? I'd love to assist you!"
            timing="long"
            type="welcome"
            actionText="Chat with me"
            autoClose={false}
            position="bottom-right"
            showChatIcon={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
