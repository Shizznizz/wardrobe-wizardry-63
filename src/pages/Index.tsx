import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BackgroundShapes from '@/components/BackgroundShapes';
import SectionDivider from '@/components/SectionDivider';
import HowItWorks from '@/components/HowItWorks';
import VerticalStepCards from '@/components/VerticalStepCards';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import StyleDiscoveryQuiz from '@/components/StyleDiscoveryQuiz';
import { useAuth } from '@/hooks/useAuth';

const testimonials = [
  {
    name: 'Emily Carter',
    title: 'Fashion Blogger',
    image: '/placeholder-user.jpg',
    text: 'I\'ve always struggled with putting outfits together, but this app makes it so easy! The AI suggestions are spot-on, and I love being able to organize my wardrobe in one place.',
  },
  {
    name: 'David Lee',
    title: 'Software Engineer',
    image: '/placeholder-user.jpg',
    text: 'As someone who doesn\'t have a lot of time to shop, this app has been a game-changer. I can quickly find new clothes that fit my style and get personalized recommendations without spending hours browsing.',
  },
  {
    name: 'Sarah Johnson',
    title: 'Marketing Manager',
    image: '/placeholder-user.jpg',
    text: 'I love how this app helps me plan my outfits in advance. The calendar integration is a lifesaver, and I always feel confident and put-together thanks to the AI-powered style advice.',
  },
];

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      <BackgroundShapes />
      
      <main className="container mx-auto px-4 pt-32 md:pt-40 pb-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              AI-Powered Personal Wardrobe Stylist
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Organize your wardrobe, discover new outfits, and get AI-powered style recommendations
            </p>
            
            {user ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-lg shadow-lg hover:shadow-purple-700/20">
                  <Link to="/my-wardrobe">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-purple-400/30 text-white hover:bg-white/10 px-8 py-6 rounded-lg">
                  <Link to="/style-quiz">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Take Style Quiz
                  </Link>
                </Button>
              </div>
            ) : (
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-lg shadow-lg hover:shadow-purple-700/20">
                <Link to="/auth">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </motion.div>
        </div>
        
        <HowItWorks />
        
        <SectionDivider />
        
        {user && <StyleDiscoveryQuiz />}
        
        <VerticalStepCards />
        
        <SectionDivider />
        
        <TestimonialsCarousel />
      </main>
    </div>
  );
};

export default Index;
