
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import PitchHeroSection from '@/components/pitch/PitchHeroSection';
import ProblemSolutionSection from '@/components/pitch/ProblemSolutionSection';
import HowItWorksSection from '@/components/pitch/HowItWorksSection';
import ScreenshotsSection from '@/components/pitch/ScreenshotsSection';
import TestimonialsSection from '@/components/pitch/TestimonialsSection';
import OliviaQuoteSection from '@/components/pitch/OliviaQuoteSection';
import PitchCTASection from '@/components/pitch/PitchCTASection';
import SocialFooter from '@/components/pitch/SocialFooter';

const Pitch = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-950 to-purple-900 text-white">
      {/* Hero Section */}
      <PitchHeroSection />
      
      {/* Problem/Solution Section */}
      <ProblemSolutionSection />
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* Screenshots Section */}
      <ScreenshotsSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Olivia Quote */}
      <OliviaQuoteSection />
      
      {/* Final CTA */}
      <PitchCTASection />
      
      {/* Social Footer */}
      <SocialFooter />
    </div>
  );
};

export default Pitch;
