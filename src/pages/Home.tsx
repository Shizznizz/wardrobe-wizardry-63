
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, ArrowRight, Crown, Shirt, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import HomepagePremiumTeaser from '@/components/HomepagePremiumTeaser';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';
import FeatureCards from '@/components/home/FeatureCards';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FinalCta from '@/components/home/FinalCta';
import TrustBar from '@/components/home/TrustBar';
import GetOliviasLook from '@/components/home/GetOliviasLook';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { useOnboardingState } from '@/hooks/useOnboardingState';

const Home = () => {
  const navigate = useNavigate();
  const [showOliviaDialog, setShowOliviaDialog] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { hasSeenOnboarding } = useOnboardingState();
  
  const handleStartJourney = () => {
    navigate('/my-wardrobe');
  };
  
  const handleTakeStyleQuiz = () => {
    navigate('/quizzes');
  };
  
  const handleMeetOlivia = () => {
    setShowOliviaDialog(true);
  };

  const handleStartOnboarding = () => {
    setShowOliviaDialog(false);
    setShowOnboarding(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#12002f] to-[#1b013c] text-white">
      <Header />
      
      <main className="pt-8 overflow-hidden">
        {/* Hero Section - Using the Enhanced Component with the old Olivia image */}
        <EnhancedHeroSection 
          title="The Future of Fashion"
          subtitle="Trusted by 10,000+ style-conscious women"
          description={
            <div className="space-y-4">
              <p>Say goodbye to style stress. Olivia curates outfits that match your vibe, wardrobe, and the weather.</p>
              <p>With Olivia, your AI stylist, you'll get personalized outfit ideas that feel just right — every single day.</p>
            </div>
          }
          image={{
            src: "/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png", // Using the old Olivia image
            alt: "Olivia Bloom, AI Fashion Stylist",
            variant: "portrait"
          }}
          buttons={[
            {
              label: "Start Your Style Journey",
              onClick: handleStartJourney,
              variant: "primary",
              icon: <ArrowRight className="h-5 w-5" />
            },
            {
              label: "Take a Style Quiz",
              onClick: handleTakeStyleQuiz,
              variant: "secondary"
            }
          ]}
          extraContent={
            <motion.div 
              className="flex items-center gap-2 text-white/80 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Sparkles className="h-4 w-4 text-coral-400" />
              <p>Olivia styles your day in seconds. Let's go!</p>
            </motion.div>
          }
          hasSparkleEffect={true}
          layoutPosition="left"
        />
        
        {/* Trust Bar */}
        <TrustBar />
        
        {/* Core Features Section */}
        <motion.section
          className="py-20 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <div className="container mx-auto max-w-6xl">
            <FeatureCards />
            
            <div className="mt-16 text-center">
              <Button 
                className="bg-gradient-to-r from-[#EC6FF1] to-[#9C68FF] text-white hover:opacity-90 transition-opacity font-semibold py-6 px-10 rounded-xl shadow-md h-auto text-lg flex items-center gap-2 mx-auto min-h-[44px]"
                onClick={handleMeetOlivia}
              >
                Meet Olivia Now
                <ArrowRight className="h-5 w-5 animate-pulse" />
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Premium Teaser Section with Olivia */}
        <HomepagePremiumTeaser />
        
        {/* Get Olivia's Look Section */}
        <GetOliviasLook />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Final CTA Section */}
        <FinalCta onGetStarted={() => navigate('/auth')} />
      </main>
      
      {/* Olivia Introduction Dialog - Styled as per specifications */}
      <Dialog open={showOliviaDialog} onOpenChange={setShowOliviaDialog}>
        <DialogContent 
          className="sm:max-w-[480px] w-[90%] mx-auto bg-[#2A004F] border-none rounded-3xl p-6 md:p-8 shadow-lg"
          onEscapeKeyDown={() => setShowOliviaDialog(false)}
          aria-labelledby="olivia-modal-title"
          aria-describedby="olivia-modal-description"
        >
          <div className="flex flex-col items-center text-center">
            {/* Close button - accessible and positioned at top-right */}
            <DialogClose asChild>
              <Button 
                className="absolute top-4 right-4 rounded-full w-8 h-8 p-0 bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            </DialogClose>
            
            {/* Olivia's avatar - circular and centered */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#EC6FF1]/50 mb-4 relative shadow-lg">
              <img 
                src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" 
                alt="Olivia Bloom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#EC6FF1]/20 to-transparent"></div>
            </div>
            
            {/* Heading - styled with accent color */}
            <h1 
              id="olivia-modal-title"
              className="text-2xl sm:text-[28px] font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#EC6FF1] to-[#9C68FF]"
            >
              Meet Olivia Bloom
            </h1>
            
            {/* Body text - responsive sizing and proper line height */}
            <div id="olivia-modal-description" className="space-y-4 text-sm sm:text-base text-white leading-relaxed max-w-md">
              <p>
                Hi there! I'm Olivia Bloom, your personal AI fashion stylist and style confidante. 
                I'm here to transform your wardrobe experience and make getting dressed the easiest 
                part of your day.
              </p>
              
              <p>
                Whether you're looking for weather-appropriate outfits, want to discover your unique 
                style, or need help mixing and matching pieces you already own — I've got you covered!
              </p>
            </div>
            
            {/* CTA buttons - responsive and accessible */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
              {/* Primary CTA button */}
              <Button 
                className="w-full py-4 text-white rounded-xl font-semibold bg-gradient-to-r from-[#EC6FF1] to-[#9C68FF] hover:opacity-90 transition-opacity min-h-[44px]"
                onClick={handleStartOnboarding}
                aria-label="Start onboarding tour"
              >
                Let me show you what you can do here!
              </Button>
              
              {/* Secondary CTA button */}
              <DialogClose asChild>
                <Button 
                  onClick={() => navigate('/my-wardrobe')}
                  className="w-full py-4 bg-white text-[#2A004F] hover:bg-white/90 rounded-xl font-semibold min-h-[44px]"
                  aria-label="Start using the app"
                >
                  Let's Get Started
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Olivia Onboarding Flow */}
      <OnboardingFlow 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
    </div>
  );
};

export default Home;
