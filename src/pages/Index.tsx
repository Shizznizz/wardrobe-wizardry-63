
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VerticalStepCards from '@/components/VerticalStepCards';
import VerticalFeatureTimeline from '@/components/VerticalFeatureTimeline';
import StylingTimeline from '@/components/StylingTimeline';
import InsightsCarousel from '@/components/InsightsCarousel';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import HowItWorks from '@/components/HowItWorks';
import SectionDivider from '@/components/SectionDivider';
import BackgroundShapes from '@/components/BackgroundShapes';
import StyleDiscoveryQuiz from '@/components/StyleDiscoveryQuiz';
import FindYourStyleQuiz from '@/components/FindYourStyleQuiz';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <BackgroundShapes />
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="max-w-3xl mx-auto text-center space-y-6 pt-10 pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Your AI Stylist for the Perfect Outfit
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Discover your personal style, organize your wardrobe, and get AI-powered outfit recommendations tailored just for you.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <Button 
              onClick={() => navigate('/my-wardrobe')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-xl text-lg shadow-lg hover:shadow-purple-500/20"
            >
              Start Your Style Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              onClick={() => navigate('/quizzes')}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-xl text-lg"
            >
              Take a Style Quiz
            </Button>
          </motion.div>
        </motion.div>
        
        {/* How It Works Section */}
        <HowItWorks />
        
        <SectionDivider label="Style Discovery" />
        
        {/* Style Quizzes Section */}
        <div className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Discover Your Style
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <StyleDiscoveryQuiz />
            <FindYourStyleQuiz />
          </div>
        </div>
        
        <SectionDivider label="Smart Styling" />
        
        {/* Feature Timeline */}
        <StylingTimeline />
        
        <SectionDivider label="Features" />
        
        {/* Step by Step Feature Cards */}
        <VerticalStepCards />
        
        {/* Feature Timeline */}
        <VerticalFeatureTimeline />
        
        <SectionDivider label="Style Insights" />
        
        {/* Insights Carousel */}
        <InsightsCarousel />
        
        <SectionDivider label="What Users Say" />
        
        {/* Testimonials */}
        <TestimonialsCarousel />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
