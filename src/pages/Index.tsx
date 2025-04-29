
import React, { useEffect, useState, useRef, useCallback } from 'react';
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
import AIStylistChat from '@/components/shop-try/AIStylistChat';

const Index = () => {
  const { user } = useAuth();
  const [showOliviaAssistant, setShowOliviaAssistant] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const insightsRef = useRef<HTMLDivElement>(null);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (!insightsRef.current) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setShowOliviaAssistant(true);
          setHasShown(true);
        }
      },
      {
        threshold: 0.4,
      }
    );
    observer.observe(insightsRef.current);
    return () => {
      if (insightsRef.current) observer.unobserve(insightsRef.current);
    };
  }, [insightsRef, hasShown]);

  useEffect(() => {
    if (!insightsRef.current) return;
    const obs = new window.IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting && !openChat && hasShown) {
          setShowOliviaAssistant(false);
        }
      },
      {
        threshold: 0,
      }
    );
    obs.observe(insightsRef.current);
    return () => {
      if (insightsRef.current) obs.unobserve(insightsRef.current);
    };
  }, [insightsRef, openChat, hasShown]);

  const handleOpenChat = useCallback(() => {
    setOpenChat(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden">
      <Header />
      <BackgroundShapes />
      
      <main className="container mx-auto px-4 pt-20 md:pt-28 pb-20 relative z-10">
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
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-center mb-6 md:mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 relative"
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
            className="text-lg sm:text-xl md:text-2xl text-center text-blue-100 mb-12 max-w-3xl mx-auto px-4"
          >
            Discover your unique style identity with Olivia Bloom, your personal AI stylist who understands exactly what makes you shine.
          </motion.p>
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 max-w-6xl mx-auto mb-16">
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
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-lg font-medium w-full sm:w-auto"
                  >
                    <Link to="/style-quiz" className="flex items-center justify-center">
                      <Star className="mr-2 h-5 w-5" />
                      Take Style Quiz
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-lg font-medium w-full sm:w-auto"
                  >
                    <Link to="/my-wardrobe" className="flex items-center justify-center">
                      Start Styling
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 mt-6 font-medium w-full sm:w-auto"
                >
                  <Link to="/auth" className="flex items-center justify-center">
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
              className="flex-1 relative order-1 md:order-2 w-full md:w-auto"
            >
              <motion.div 
                className="relative group mb-16 md:mb-8" // Added more bottom margin for mobile
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
                  className="absolute -bottom-14 sm:-bottom-12 md:-bottom-10 right-0 md:-right-8 max-w-xs transform rotate-2 z-20 mb-4 sm:mb-2" // Added bottom margin
                >
                  <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 p-4 sm:p-5 md:p-6 rounded-xl shadow-xl backdrop-blur-sm border border-white/20 text-white">
                    <p className="text-sm sm:text-base md:text-lg font-medium">
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

        {user && (
          <>
            <div className="py-8 md:py-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="text-center max-w-4xl mx-auto mb-8"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-pink-400">
                  Elevate Your Style Today
                </h2>
                <p className="text-lg text-blue-100/90">
                  Discover outfits perfectly tailored to your unique style profile and preferences.
                  Let Olivia guide you to your most confident self.
                </p>
              </motion.div>
              <StyleDiscoveryQuiz />
            </div>
            <SectionDivider variant="dotted" />
          </>
        )}
        
        <div ref={insightsRef} id="style-intelligence-section" className="mt-16 md:mt-20"> 
          <InsightsCarousel />
        </div>
        
        <SectionDivider variant="dotted" />
        
        <VerticalFeatureTimeline />
        
        <SectionDivider />
        
        <OliviaStyleAdvice className="mt-16 mb-24" />
        
        <HomepagePremiumTeaser />
        
        <SectionDivider />
        
        <HowItWorks />
        
        <SectionDivider />
        
        <TestimonialsCarousel />
        
        {/* Removed the duplicate StyleDiscoveryQuiz component that was here */}
      </main>
      
      <AnimatePresence>
        {showOliviaAssistant && !openChat && (
          <OliviaBloomAssistant 
            message="Need help finding your perfect style? I'd love to assist you!"
            timing="long"
            type="welcome"
            actionText="Chat with me"
            autoClose={false}
            position="bottom-right"
            showChatIcon={true}
            onAction={handleOpenChat}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {openChat && (
          <AIStylistChat
            isPremiumUser={true}
            onUpgradeToPremium={() => {}}
            onClose={() => setOpenChat(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
