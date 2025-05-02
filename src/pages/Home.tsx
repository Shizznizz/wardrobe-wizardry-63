
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, ArrowRight, Crown, Shirt, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import HomepagePremiumTeaser from '@/components/HomepagePremiumTeaser';
import EnhancedHeroSection from '@/components/home/EnhancedHeroSection';
import FeatureCards from '@/components/home/FeatureCards';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FinalCta from '@/components/home/FinalCta';
import TrustBar from '@/components/home/TrustBar';

const Home = () => {
  const navigate = useNavigate();
  
  const handleStartJourney = () => {
    navigate('/mix-and-match');
  };
  
  const handleTakeStyleQuiz = () => {
    navigate('/quizzes');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#12002f] to-[#1b013c] text-white">
      <Header />
      
      <main className="pt-8 overflow-hidden">
        {/* Enhanced Hero Section */}
        <EnhancedHeroSection 
          onStartJourney={handleStartJourney}
          onTakeStyleQuiz={handleTakeStyleQuiz}
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
                className="bg-gradient-to-r from-[#ff4ecb] to-[#a97eff] text-white hover:scale-[1.03] transition-transform font-bold py-6 px-10 rounded-xl shadow-md h-auto text-lg flex items-center gap-2"
                onClick={handleStartJourney}
              >
                Meet Olivia Now
                <ArrowRight className="h-5 w-5 animate-pulse" />
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Premium Teaser Section with Olivia */}
        <HomepagePremiumTeaser />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Final CTA Section */}
        <FinalCta onGetStarted={() => navigate('/auth')} />
      </main>
    </div>
  );
};

export default Home;
