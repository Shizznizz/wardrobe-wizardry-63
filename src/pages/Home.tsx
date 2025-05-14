
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
import VirtualTryOnSteps from '@/components/home/VirtualTryOnSteps';
import OliviasWeeklyTip from '@/components/home/OliviasWeeklyTip';
import OliviasLookOfTheWeek from '@/components/home/OliviasLookOfTheWeek';
import { CTAButton } from '@/components/ui/cta-button';

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
      {/* Removing the duplicate Header component */}
      
      <main className="pt-8 overflow-hidden">
        {/* 1. Hero Section with optimized mobile layout from home.tsx */}
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
        
        {/* 2. Trust Bar from home.tsx */}
        <TrustBar />
        
        {/* 3. Core Features Section with Meet Olivia button from home.tsx */}
        <CoreFeaturesSection onMeetOlivia={handleMeetOlivia} />
        
        {/* 4. Virtual Try-On Steps from index.tsx - Enhanced version */}
        <VirtualTryOnSteps />

        {/* New Premium Button Section */}
        <section className="py-20 bg-[#1b013c]">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <CTAButton 
                className="bg-gradient-to-r from-[#EC6FF1] to-[#FF8AF0] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/premium')}
              >
                Let Me Show You What's Possible with Premium
              </CTAButton>
            </div>
          </div>
        </section>

        {/* 5. Olivia's Look of the Week from index.tsx */}
        <OliviasLookOfTheWeek />

        {/* 6. Olivia's Weekly Tip Section from index.tsx */}
        <OliviasWeeklyTip />

        {/* 7. Testimonials Section from index.tsx */}
        <TestimonialsSection />

        {/* 8. Final CTA Section from home.tsx */}
        <FinalCta onGetStarted={() => navigate('/auth')} />

        {/* Premium Sticky Footer */}
        <HomepagePremiumTeaser />
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
