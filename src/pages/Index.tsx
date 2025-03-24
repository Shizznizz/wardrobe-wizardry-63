import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shirt, Palette, Cloud, Sparkles, Clock, History, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Header from '@/components/Header';
import PreferencesModal from '@/components/PreferencesModal';
import { UserPreferences } from '@/lib/types';
import OutfitSlider from '@/components/OutfitSlider';
import VerticalStepCards from '@/components/VerticalStepCards';
import StylingTimeline from '@/components/StylingTimeline';
import BackgroundShapes from '@/components/BackgroundShapes';
import StyleSituation from '@/components/StyleSituation';

const Index = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteColors: ['black', 'blue', 'white'],
    favoriteStyles: ['casual', 'minimalist'],
    seasonalPreferences: {
      spring: { enabled: true, temperatureRange: [10, 22] },
      summer: { enabled: true, temperatureRange: [20, 35] },
      autumn: { enabled: true, temperatureRange: [8, 20] },
      winter: { enabled: true, temperatureRange: [-5, 10] },
      all: { enabled: true, temperatureRange: [-10, 40] }
    },
    outfitReminders: false,
    reminderTime: '08:00'
  });
  
  const handleUpdatePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const handleWardrobeButtonClick = () => {
    if (window.location.pathname === "/") {
      window.location.href = "/wardrobe#upload";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white relative overflow-hidden">
      <BackgroundShapes />
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <motion.div 
          className="space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.section variants={itemVariants} className="flex flex-col items-center justify-center text-center space-y-8">
            <div className="relative flex items-center justify-center gap-3 flex-wrap">
              <div className="relative inline-block">
                <motion.div 
                  className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 opacity-75 blur-xl"
                  animate={{ 
                    opacity: [0.5, 0.8, 0.5],
                    scale: [0.98, 1.01, 0.98]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                />
                <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 pb-2">
                  Future of Fashion
                </h1>
              </div>
              
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <Avatar className="w-24 h-24 border-2 border-pink-400 shadow-lg">
                  <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
                  <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            </div>
            
            <motion.div
              animate={{ 
                scale: [1, 1.02, 1],
                filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"] 
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-4"
            />
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="max-w-3xl mx-auto relative"
            >
              <div className="relative p-5 mb-6 rounded-2xl neo-blur shadow-lg border border-pink-500/30">
                <div className="absolute w-4 h-4 bg-pink-500 rotate-45 top-0 right-12 -mt-2"></div>
                <p className="text-lg text-pink-100">
                  Hi, I'm Olivia — your personal AI stylist. Let's make magic with your wardrobe.
                </p>
              </div>
            </motion.div>
            
            <p className="text-xl text-blue-100 max-w-2xl backdrop-blur-sm py-4 px-6 rounded-lg border border-white/10 shadow-lg neo-blur">
              Smarter styling starts here. AI-curated outfits that fit your style, your body, and your weather.
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center mt-6">
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="min-w-[240px]"
              >
                <Button 
                  size="lg" 
                  onClick={handleWardrobeButtonClick}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-lg px-5 py-3 h-10 transition-all shadow-xl hover:shadow-purple-500/20 w-full border border-blue-500/20"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center justify-center gap-2">
                    Start Building My Wardrobe
                    <motion.div
                      className="inline-block"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>
              
              <PreferencesModal 
                preferences={preferences} 
                onSave={handleUpdatePreferences} 
                buttonClassName="text-lg px-5 py-3 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-xl hover:shadow-purple-500/20 min-w-[120px] border border-blue-500/20"
              />
            </div>
          </motion.section>
          
          <motion.section variants={itemVariants} className="mt-8">
            <StyleSituation />
          </motion.section>
          
          <motion.section variants={itemVariants} className="mt-16">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              <span className="flex items-center gap-2">
                <Palette className="h-6 w-6" />
                Outfit Inspirations
              </span>
            </h2>
            <OutfitSlider />
          </motion.section>
          
          <motion.section variants={itemVariants} className="mt-16">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              <span className="flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                Showcase Process
              </span>
            </h2>
            <VerticalStepCards />
          </motion.section>
          
          <motion.section variants={itemVariants} className="mt-16">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
              <span className="flex items-center gap-2">
                <History className="h-6 w-6" />
                Styling Journey
              </span>
            </h2>
            <StylingTimeline />
          </motion.section>
          
          <motion.section variants={itemVariants} className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link to="/wardrobe" className="block">
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-dark p-8 rounded-2xl border border-blue-500/20 backdrop-blur-lg bg-slate-900/40 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-400/20">
                      <Shirt className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-blue-200">Virtual Wardrobe</h3>
                    <p className="text-blue-100/80">
                      Digitize your entire collection with smart categorization and instant access.
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <ArrowRight className="h-5 w-5 text-blue-400" />
                  </div>
                </motion.div>
              </Link>
              
              <Link to="/outfits" className="block">
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-dark p-8 rounded-2xl border border-purple-500/20 backdrop-blur-lg bg-slate-900/40 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-400/20">
                      <Palette className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-purple-200">AI Styling</h3>
                    <p className="text-purple-100/80">
                      Create perfectly coordinated outfits with AI that understands your personal style.
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <ArrowRight className="h-5 w-5 text-purple-400" />
                  </div>
                </motion.div>
              </Link>
              
              <Link to="/try-on" className="block">
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-dark p-8 rounded-2xl border border-pink-500/20 backdrop-blur-lg bg-slate-900/40 shadow-lg hover:shadow-pink-500/10 transition-all duration-300 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-400/20">
                      <Sparkles className="h-8 w-8 text-pink-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-pink-200">Showcase</h3>
                    <p className="text-pink-100/80">
                      See exactly how outfits look on you with our cutting-edge virtual fitting room.
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <ArrowRight className="h-5 w-5 text-pink-400" />
                  </div>
                </motion.div>
              </Link>
              
              <Link to="/new-clothes" className="block">
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-dark p-8 rounded-2xl border border-emerald-500/20 backdrop-blur-lg bg-slate-900/40 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-400/20">
                      <Shirt className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-emerald-200">New Clothes</h3>
                    <p className="text-emerald-100/80">
                      Visualize how new clothes would look on you before making a purchase decision.
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <ArrowRight className="h-5 w-5 text-emerald-400" />
                  </div>
                </motion.div>
              </Link>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;

