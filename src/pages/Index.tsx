import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

import Header from '@/components/Header';
import BackgroundShapes from '@/components/BackgroundShapes';
import HeroSection from '@/components/home/HeroSection';
import OptimizedImage from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import SectionDivider from '@/components/SectionDivider';
import HomepagePremiumTeaser from '@/components/HomepagePremiumTeaser';
import MeetOliviaDialog from '@/components/home/MeetOliviaDialog';
import FeatureCards from '@/components/home/FeatureCards';
import VirtualTryOnSteps from '@/components/home/VirtualTryOnSteps';
import OliviasWeeklyTip from '@/components/home/OliviasWeeklyTip';
import OliviasLookOfTheWeek from '@/components/home/OliviasLookOfTheWeek';
import PremiumTeaserSection from '@/components/home/PremiumTeaserSection';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [isOliviaMeetOpen, setIsOliviaMeetOpen] = useState(false);
  
  // Animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };
  
  // Counter animation refs
  const counterRef = React.useRef(null);
  const isCounterInView = useInView(counterRef, { once: true });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Counter animation state
  const [countWardrobe, setCountWardrobe] = useState(0);
  const [countOutfits, setCountOutfits] = useState(0);
  const [countHappy, setCountHappy] = useState(0);
  
  // Run counter animation when in view
  useEffect(() => {
    if (isCounterInView && !hasAnimated) {
      const wardrobeInterval = setInterval(() => {
        setCountWardrobe(prev => {
          const nextValue = prev + 100;
          if (nextValue >= 10000) {
            clearInterval(wardrobeInterval);
            return 10000;
          }
          return nextValue;
        });
      }, 20);
      
      const outfitsInterval = setInterval(() => {
        setCountOutfits(prev => {
          const nextValue = prev + 2500;
          if (nextValue >= 250000) {
            clearInterval(outfitsInterval);
            return 250000;
          }
          return nextValue;
        });
      }, 20);
      
      const happyInterval = setInterval(() => {
        setCountHappy(prev => {
          const nextValue = prev + 1;
          if (nextValue >= 98) {
            clearInterval(happyInterval);
            return 98;
          }
          return nextValue;
        });
      }, 20);
      
      setHasAnimated(true);
      
      return () => {
        clearInterval(wardrobeInterval);
        clearInterval(outfitsInterval);
        clearInterval(happyInterval);
      };
    }
  }, [isCounterInView, hasAnimated]);

  // Handler functions for MeetOliviaDialog
  const handleStartOnboarding = () => {
    // Start onboarding logic here
    console.log("Starting onboarding tour");
    // For now, we'll just close the dialog
    setIsOliviaMeetOpen(false);
  };

  const handleGetStarted = () => {
    // Get started logic here  
    console.log("Let's get started!");
    // Navigation could be added here if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-hidden">
      <BackgroundShapes />
      <Header />
      
      <main className="relative z-10">
        {/* 1. Hero Section - Unchanged */}
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#1d0034] to-[#2c0055] text-center relative overflow-hidden">
          <motion.div 
            className="container mx-auto px-4 flex flex-col items-center relative z-10"
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
            
            {/* Social proof line */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/80 mb-8 text-base md:text-lg"
            >
              Trusted by 10,000+ style-conscious women.
            </motion.p>
            
            <motion.h3 
              className="text-lg md:text-xl lg:text-2xl font-semibold text-[#ffb3ec] mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ lineHeight: '1.5' }}
            >
              Say goodbye to style stress. <span className="relative">
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-medium">
                  Olivia
                </span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-400 to-purple-400 opacity-70"></span>
              </span> curates outfits that match your vibe, wardrobe, and the weather.
            </motion.h3>
            
            <motion.p 
              className="text-[#e0d8f9] max-w-md md:max-w-lg mb-8 text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ lineHeight: '1.5' }}
            >
              With <span className="relative">
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-medium">
                  Olivia
                </span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-400 to-purple-400 opacity-70"></span>
              </span>, your AI stylist, you'll get personalized outfit ideas that feel just right — every single day.
            </motion.p>

            {/* Half-body Olivia image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative mb-8 max-w-xs mx-auto"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 to-purple-500/20 blur-2xl rounded-full"></div>
              <img 
                src="/lovable-uploads/34e8d801-61ee-4254-a7ce-39b52a3a7e65.png" 
                alt="Olivia" 
                className="relative z-10 max-h-[240px] mx-auto drop-shadow-2xl"
              />
            </motion.div>
            
            <motion.div 
              className="flex gap-4 justify-center shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button 
                onClick={() => navigate('/my-wardrobe')}
                className="bg-gradient-to-r from-[#ff66cc] to-[#ff3366] hover:opacity-90 text-white px-6 py-6 rounded-lg font-semibold group shadow-md shadow-pink-500/20 hover:shadow-pink-500/30 transition-all duration-300"
              >
                Start Your Style Journey
                <ArrowRight className="ml-2 h-5 w-5 duration-300 group-hover:translate-x-1" />
              </Button>
              
              <Button 
                onClick={() => navigate('/quizzes')}
                variant="outline" 
                className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/30 px-6 py-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                Take a Style Quiz
              </Button>
            </motion.div>
            
            {/* Secondary line with emoji and animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-white/70 text-sm mt-6 flex items-center justify-center"
            >
              <motion.span 
                className="inline-block mr-1"
                animate={{ 
                  rotate: [0, 15, -15, 15, 0],
                  scale: [1, 1.2, 1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 3
                }}
              >
                ✨
              </motion.span>
              <span>
                <span className="relative">
                  <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-medium">
                    Olivia
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-400 to-purple-400 opacity-70"></span>
                </span> styles your day in seconds. Let's go!
              </span>
            </motion.div>
          </motion.div>
        </section>

        {/* 2. Combined Key Benefits + Meet Olivia Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Why go on this adventure with Olivia?
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
            </motion.div>
            
            <FeatureCards />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 text-center"
            >
              <Button 
                onClick={() => setIsOliviaMeetOpen(true)}
                className="coral-button text-lg px-8 py-3 bg-gradient-to-r from-[#EC6FF1] to-[#FF8AF0]"
              >
                Meet Olivia Now
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* 3. How Virtual Try-On Works Section */}
        <VirtualTryOnSteps />

        {/* 4. Olivia's Look of the Week */}
        <OliviasLookOfTheWeek />

        {/* 5. Olivia's Weekly Tip Section */}
        <OliviasWeeklyTip />

        {/* 6. Testimonials Section - Unchanged */}
        <TestimonialsCarousel />

        {/* 7. Ready to Transform Section - Unchanged */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div ref={counterRef} className="flex flex-wrap justify-center gap-6 md:gap-16 mb-12">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-blue-400">
                    {countWardrobe.toLocaleString()}+
                  </p>
                  <p className="text-sm text-blue-100/70 mt-1">Wardrobes Styled</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-purple-400">
                    {countOutfits.toLocaleString()}+
                  </p>
                  <p className="text-sm text-blue-100/70 mt-1">Outfits Created</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-pink-400">
                    {countHappy}%
                  </p>
                  <p className="text-sm text-blue-100/70 mt-1">Happy Users</p>
                </div>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Join the Style Movement
              </h2>
              
              <p className="text-xl text-blue-100/80 mb-10 max-w-3xl mx-auto">
                Start your styling journey today and transform the way you dress with AI-powered fashion advice.
              </p>
              
              <div className="flex flex-col md:flex-row justify-center gap-6 items-center">
                <Button 
                  onClick={() => navigate('/auth')}
                  className="btn-futuristic text-lg px-12 py-7 group"
                >
                  Join for Free
                  <ArrowRight className="ml-2 h-5 w-5 duration-300 group-hover:translate-x-1" />
                </Button>
                
                <div className="flex items-center gap-3 text-blue-100/90 bg-slate-800/40 p-3 rounded-lg border border-white/10">
                  <div className="h-12 w-12 relative">
                    <img 
                      src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" 
                      alt="Olivia" 
                      className="h-full w-full object-cover rounded-full border-2 border-pink-400/30"
                    />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800"></span>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-2 top-0 w-2 h-2 bg-slate-800/40 transform rotate-45"></div>
                    <div className="bg-slate-800/70 px-4 py-2 rounded-lg">
                      <span className="text-sm">I'm ready when you are! 💫</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 8. New Premium Teaser Section */}
        <PremiumTeaserSection />

        {/* HomepagePremiumTeaser - Unchanged */}
        <HomepagePremiumTeaser />
      </main>
      
      {/* Meet Olivia Dialog */}
      <MeetOliviaDialog 
        open={isOliviaMeetOpen} 
        onOpenChange={setIsOliviaMeetOpen}
        onStartOnboarding={handleStartOnboarding}
        onGetStarted={handleGetStarted}
      />
    </div>
  );
};

export default Index;
