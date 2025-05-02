
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import HeroSection from '@/components/shared/HeroSection';
import { Button } from '@/components/ui/button';

const Home = () => {
  const navigate = useNavigate();
  
  const handleStartJourney = () => {
    navigate('/mix-and-match');
  };
  
  const handleTakeStyleQuiz = () => {
    // This would link to a style quiz page if implemented
    navigate('/style-quiz');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#12002f] to-[#1b013c] text-white">
      <Header />
      
      <main className="pt-16">
        <HeroSection
          title="The Future of Fashion"
          subtitle="Trusted by 10,000+ style-conscious women."
          description={
            <div className="space-y-4">
              <p>
                Say goodbye to style stress. Olivia curates outfits that match your vibe, wardrobe, and the weather.
              </p>
              <p>
                With Olivia, your AI stylist, you'll get personalized outfit ideas that feel just right — every single day.
              </p>
            </div>
          }
          image={{
            src: "/lovable-uploads/117f17c5-142c-43a5-88dd-5fb06adbbe27.png",
            alt: "Olivia - Your AI Fashion Assistant",
            variant: "standing"
          }}
          layoutPosition="right"
          buttons={[
            {
              label: "Start Your Style Journey",
              onClick: handleStartJourney,
              variant: "primary"
            },
            {
              label: "Take a Style Quiz",
              onClick: handleTakeStyleQuiz,
              variant: "secondary"
            }
          ]}
          extraContent={
            <div className="flex items-center justify-center md:justify-start gap-2 text-white/80 mt-4">
              <Sparkles className="h-4 w-4 text-coral-400" />
              <p>Olivia styles your day in seconds. Let's go!</p>
            </div>
          }
          hasSparkleEffect={true}
        />
        
        <motion.section
          className="py-24 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FashionFeature 
                title="Personal Style Discovery"
                description="Olivia learns your style preferences and helps you discover new looks that express your unique personality."
                icon={<div className="w-12 h-12 rounded-full bg-gradient-to-r from-coral-500 to-purple-500 flex items-center justify-center">👗</div>}
              />
              <FashionFeature 
                title="Weather-Smart Fashion"
                description="Never dress inappropriately for the weather again. Olivia checks your local forecast and suggests outfits accordingly."
                icon={<div className="w-12 h-12 rounded-full bg-gradient-to-r from-coral-500 to-purple-500 flex items-center justify-center">☁️</div>}
              />
              <FashionFeature 
                title="Virtual Try-On"
                description="See how clothes look on you before buying or wearing them. Olivia's virtual fitting room makes fashion decisions easy."
                icon={<div className="w-12 h-12 rounded-full bg-gradient-to-r from-coral-500 to-purple-500 flex items-center justify-center">🪞</div>}
              />
            </div>
            
            <div className="mt-16 text-center">
              <Button 
                className="bg-gradient-to-r from-[#ff4ecb] to-[#a97eff] text-white hover:scale-[1.03] transition-transform font-bold py-6 px-8 rounded-xl shadow-md h-auto text-lg"
                onClick={handleStartJourney}
              >
                Meet Olivia Now
              </Button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

// Feature component for the home page
const FashionFeature = ({ title, description, icon }: { 
  title: string; 
  description: string; 
  icon: React.ReactNode 
}) => {
  return (
    <motion.div 
      className="glass-dark p-8 rounded-2xl border border-white/10"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-purple-400">
        {title}
      </h3>
      <p className="text-white/70">
        {description}
      </p>
    </motion.div>
  );
};

export default Home;
