
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '@/components/Header';
import HomepagePremiumTeaser from '@/components/HomepagePremiumTeaser';
import HeroSection from '@/components/home/HeroSection';
import CoreFeaturesSection from '@/components/home/CoreFeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FinalCta from '@/components/home/FinalCta';
import TrustBar from '@/components/home/TrustBar';
import GetOliviasLook from '@/components/home/GetOliviasLook';
import MeetOliviaDialog from '@/components/home/MeetOliviaDialog';
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
  
  // Home page already has the enhanced hero section via the HeroSection component
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#12002f] to-[#1b013c] text-white">
      <Header />
      
      <main className="pt-8 overflow-hidden">
        {/* Hero Section with optimized mobile layout */}
        <HeroSection
          title="The Future of Fashion"
          subtitle="Trusted by 10,000+ style-conscious women"
          description={
            <div className="space-y-4">
              <p>Say goodbye to style stress. Olivia curates outfits that match your vibe, wardrobe, and the weather.</p>
              <p>With Olivia, your AI stylist, you'll get personalized outfit ideas that feel just right — every single day.</p>
            </div>
          }
          imageSrc="/lovable-uploads/e1aaa230-1623-42c4-ab9f-eb7c5f103ebe.png"
          imageAlt="Olivia Bloom, AI Fashion Stylist"
          layoutPosition="right"
          onStartJourney={handleStartJourney}
          onTakeStyleQuiz={handleTakeStyleQuiz}
          hasSparkleEffect={true}
        />
        
        {/* Trust Bar */}
        <TrustBar />
        
        {/* Core Features Section */}
        <CoreFeaturesSection onMeetOlivia={handleMeetOlivia} />
        
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
      
      {/* Olivia Introduction Dialog */}
      <MeetOliviaDialog
        open={showOliviaDialog}
        onOpenChange={setShowOliviaDialog}
        onStartOnboarding={handleStartOnboarding}
        onGetStarted={() => navigate('/my-wardrobe')}
      />

      {/* Olivia Onboarding Flow */}
      <OnboardingFlow 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
    </div>
  );
};

export default Home;
