
import React, { useState } from 'react';
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
import GetOliviasLook from '@/components/home/GetOliviasLook';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

const Home = () => {
  const navigate = useNavigate();
  const [showOliviaDialog, setShowOliviaDialog] = useState(false);
  
  const handleStartJourney = () => {
    navigate('/my-wardrobe');
  };
  
  const handleTakeStyleQuiz = () => {
    navigate('/quizzes');
  };
  
  const handleMeetOlivia = () => {
    setShowOliviaDialog(true);
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
                className="bg-gradient-to-r from-[#ff4ecb] to-[#a97eff] text-white hover:scale-[1.03] transition-transform font-bold py-6 px-10 rounded-xl shadow-md h-auto text-lg flex items-center gap-2 mx-auto"
                onClick={handleMeetOlivia}
              >
                Meet Olivia Now
                <ArrowRight className="h-5 w-5 animate-pulse" />
              </Button>
            </div>
          </div>
        </motion.section>

        {/* NEW: Get Olivia's Look Section */}
        <GetOliviasLook />

        {/* Premium Teaser Section with Olivia */}
        <HomepagePremiumTeaser />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Final CTA Section */}
        <FinalCta onGetStarted={() => navigate('/auth')} />
      </main>
      
      {/* Olivia Introduction Dialog */}
      <Dialog open={showOliviaDialog} onOpenChange={setShowOliviaDialog}>
        <DialogContent className="sm:max-w-lg bg-gradient-to-r from-[#12002f] to-[#1b013c] border border-white/10">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[#ff4ecb] mb-6 relative">
              <img 
                src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" 
                alt="Olivia Bloom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#ff4ecb]/20 to-transparent"></div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ff4ecb] to-[#a97eff]">
              Meet Olivia Bloom
            </h2>
            
            <p className="text-white/90 mb-6 max-w-md">
              Hi there! I'm Olivia Bloom, your personal AI fashion stylist and style confidante. 
              I'm here to transform your wardrobe experience and make getting dressed the easiest 
              part of your day. 
            </p>
            
            <p className="text-white/90 mb-6 max-w-md">
              Whether you're looking for weather-appropriate outfits, want to discover your unique 
              style, or need help mixing and matching pieces you already own — I've got you covered!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <DialogClose asChild>
                <Button 
                  className="bg-gradient-to-r from-[#ff4ecb] to-[#a97eff] text-white hover:opacity-90 py-2 px-6 rounded-lg h-auto"
                  onClick={() => navigate('/my-wardrobe')}
                >
                  Let's Get Started
                </Button>
              </DialogClose>
              
              <DialogClose asChild>
                <Button 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 py-2 px-6 rounded-lg h-auto"
                >
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
