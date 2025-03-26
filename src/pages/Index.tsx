
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shirt, Palette, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Header from '@/components/Header';
import PreferencesModal from '@/components/PreferencesModal';
import { UserPreferences } from '@/lib/types';
import OutfitSlider from '@/components/OutfitSlider';
import VerticalStepCards from '@/components/VerticalStepCards';
import StylingTimeline from '@/components/StylingTimeline';
import BackgroundShapes from '@/components/BackgroundShapes';
import StyleSituation from '@/components/StyleSituation';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import OliviaStyleAdvice from '@/components/OliviaStyleAdvice';
import StyleDiscoveryQuiz from '@/components/StyleDiscoveryQuiz';
import { useIsMobile } from '@/hooks/use-mobile';

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
  
  const isMobile = useIsMobile();
  
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
  
  const [showOliviaWelcome, setShowOliviaWelcome] = useState(true);
  const [expandOliviaMessage, setExpandOliviaMessage] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white relative overflow-hidden">
      <BackgroundShapes />
      <Header />
      
      <div className={`fixed ${isMobile ? 'right-4 top-48 z-30' : 'top-52 right-6'} z-50`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200, duration: 0.5, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-pink-500/60 via-purple-500/60 to-indigo-500/60 blur-md animate-pulse"></div>
                <Avatar className={`${isMobile ? 'w-16 h-16' : 'w-22 h-22'} border-2 border-pink-400 shadow-xl cursor-pointer relative hover:scale-105 transition-transform duration-300`} onClick={() => setExpandOliviaMessage(!expandOliviaMessage)}>
                  <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
                  <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
                </Avatar>
                
                {showOliviaWelcome && !expandOliviaMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.3 }}
                    className="absolute bottom-0 right-0"
                  >
                    <div className="relative p-2 rounded-full bg-pink-500 text-white shadow-lg animate-pulse">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-purple-900/90 text-white border border-pink-400/30">
              <p>Chat with Olivia, your style assistant!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {showOliviaWelcome && expandOliviaMessage && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`absolute ${isMobile ? 'right-0 top-20 max-w-[250px]' : 'top-24 right-0 z-20 w-68 max-w-280'} scale-85 origin-top-right`}
          >
            <div className="olivia-bubble relative p-4 rounded-xl bg-gradient-to-br from-purple-600/90 to-pink-600/90 text-white backdrop-blur-sm shadow-lg border border-white/20 curved-pointer olivia-glow">
              <button 
                onClick={() => setExpandOliviaMessage(false)} 
                className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                  <ArrowRight className="h-4 w-4 text-white/80" />
                </motion.div>
              </button>
              <div className="flex items-center mb-3">
                <h4 className="font-medium text-white flex items-center text-sm">
                  Olivia Bloom
                  <Sparkles className="h-3.5 w-3.5 ml-1 text-yellow-300" />
                </h4>
                <span className="ml-2 text-xs bg-gradient-to-r from-purple-600/80 to-pink-500/80 text-white px-2 py-0.5 rounded-full text-[10px]">
                  Style Advisor
                </span>
              </div>
              <p className="text-white/90 text-xs mb-3">
                Welcome to Future of Fashion! I'm Olivia, your personal style advisor. I'll help you create outfits that match your style and the weather. What would you like to explore today?
              </p>
              <Button 
                onClick={() => {
                  setShowOliviaWelcome(false);
                  setExpandOliviaMessage(false);
                }}
                className="text-xs px-3 py-1 h-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90"
                size="sm"
              >
                Thanks, Olivia!
              </Button>
            </div>
          </motion.div>
        )}
      </div>
      
      <main className={`container mx-auto px-4 ${isMobile ? 'pt-20' : 'pt-40'} pb-16 relative z-10`}>
        <motion.div 
          className="space-y-12 md:space-y-24"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.section 
            variants={itemVariants} 
            className={`flex flex-col items-center justify-center text-center space-y-4 relative ${isMobile ? 'min-h-[55vh]' : 'min-h-[70vh]'}`}
          >
            <div className={`${isMobile ? 'mt-8 mb-28' : '-mt-20'} relative inline-block`}>
              <motion.div 
                className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 opacity-75 blur-xl"
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
              <h1 className={`relative ${isMobile ? 'text-5xl font-extrabold' : 'text-6xl md:text-7xl lg:text-8xl font-black'} tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 pb-2 whitespace-nowrap`}>
                Future of Fashion
              </h1>
            </div>
            
            <motion.div
              animate={{ 
                scale: [1, 1.03, 1],
                filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"] 
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-6"
            />
            
            <p className={`${isMobile ? 'text-base mt-6' : 'text-xl mt-16'} text-blue-100 max-w-2xl backdrop-blur-sm py-6 px-8 rounded-xl border border-white/10 shadow-xl neo-blur leading-relaxed`}>
              Smarter styling starts here. AI-curated outfits that fit your style, your body, and your weather.
            </p>
            
            <div className={`flex ${isMobile ? 'flex-col mt-12 w-full space-y-4' : 'flex-wrap mt-16 space-x-6'} justify-center`}>
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className={`${isMobile ? 'w-full' : 'min-w-[240px]'}`}
              >
                <Button 
                  size="lg" 
                  onClick={handleWardrobeButtonClick}
                  className={`group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-lg px-6 py-6 h-auto transition-all shadow-xl hover:shadow-purple-500/30 ${isMobile ? 'w-full text-base font-medium' : 'w-full font-semibold'} border border-blue-500/20`}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center justify-center gap-2">
                    Start Building My Wardrobe
                    <motion.div
                      className="inline-block"
                      animate={{ x: [0, 5, 0] }}
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
              
              <motion.div whileHover={{ scale: 1.05 }} className={`${isMobile ? 'w-full' : ''}`}>
                <PreferencesModal 
                  preferences={preferences} 
                  onSave={handleUpdatePreferences} 
                  buttonClassName={`${isMobile ? 'text-base w-full py-6 font-medium' : 'text-lg w-full py-6 px-6 font-semibold'} h-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-xl shadow-xl hover:shadow-pink-500/30 min-w-[120px] border border-pink-500/20`}
                />
              </motion.div>
            </div>
          </motion.section>
          
          <motion.section variants={itemVariants} className="mt-12 relative">
            <StyleDiscoveryQuiz />
          </motion.section>
          
          <motion.section variants={itemVariants} className="mt-16 relative">
            <StyleSituation />
          </motion.section>
          
          <motion.section variants={itemVariants} className="mt-24 relative">
            <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400`}>
              <span className="flex items-center gap-2">
                <Palette className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'}`} />
                Outfit Inspirations
              </span>
            </h2>
            <OutfitSlider />
          </motion.section>
          
          <motion.section variants={itemVariants} className="mt-24 relative">
            <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400`}>
              <span className="flex items-center gap-2">
                <Sparkles className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'}`} />
                Showcase Process
              </span>
            </h2>
            <VerticalStepCards />
          </motion.section>
          
          <motion.section variants={itemVariants} className="mt-24 relative">
            <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400`}>
              <span className="flex items-center gap-2">
                <Sparkles className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'}`} />
                Styling Journey
              </span>
            </h2>
            <StylingTimeline />
          </motion.section>
          
          <motion.section variants={itemVariants} className="mt-24">
            <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400`}>
              <span className="flex items-center gap-2">
                <Sparkles className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'}`} />
                Olivia's Style Advice
              </span>
            </h2>
            
            <OliviaStyleAdvice />
          </motion.section>
          
          <motion.section variants={itemVariants} className="mt-24">
            <div className={`grid grid-cols-1 ${isMobile ? 'gap-8' : 'md:grid-cols-2 lg:grid-cols-4 gap-10'}`}>
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
              
              <Link to="/showroom" className="block">
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-dark p-8 rounded-2xl border border-pink-500/20 backdrop-blur-lg bg-slate-900/40 shadow-lg hover:shadow-pink-500/10 transition-all duration-300 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-400/20">
                      <Sparkles className="h-8 w-8 text-pink-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-pink-200">Showroom</h3>
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
