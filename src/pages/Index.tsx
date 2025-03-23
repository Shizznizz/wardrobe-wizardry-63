
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shirt, Palette, Cloud, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import PreferencesModal from '@/components/PreferencesModal';
import { UserPreferences } from '@/lib/types';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.section variants={itemVariants} className="flex flex-col items-center justify-center text-center space-y-8">
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
              animate={{ 
                scale: [1, 1.02, 1],
                filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"] 
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-4"
            />
            
            <p className="text-xl text-blue-100 max-w-2xl backdrop-blur-sm py-4 px-6 rounded-lg border border-white/10 shadow-lg neo-blur">
              Experience AI-powered wardrobe management that adapts to your style and the weather, with visual try-on technology.
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center mt-6">
              <Link to="/wardrobe">
                <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-lg px-8 py-6 h-auto transition-all shadow-xl hover:shadow-purple-500/20">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    Get Started
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              
              <PreferencesModal 
                preferences={preferences} 
                onSave={handleUpdatePreferences} 
              />
            </div>
          </motion.section>
          
          <motion.section variants={itemVariants} className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/wardrobe" className="block">
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-dark p-8 rounded-2xl border border-blue-500/20 backdrop-blur-lg bg-slate-900/40 shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                >
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-400/20">
                    <Shirt className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-blue-200">Virtual Wardrobe</h3>
                  <p className="text-blue-100/80">
                    Digitize your entire collection with smart categorization and instant access.
                  </p>
                  <div className="mt-6 flex justify-end">
                    <ArrowRight className="h-5 w-5 text-blue-400" />
                  </div>
                </motion.div>
              </Link>
              
              <Link to="/outfits" className="block">
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-dark p-8 rounded-2xl border border-purple-500/20 backdrop-blur-lg bg-slate-900/40 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                >
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-400/20">
                    <Palette className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-purple-200">AI Styling</h3>
                  <p className="text-purple-100/80">
                    Create perfectly coordinated outfits with AI that understands your personal style.
                  </p>
                  <div className="mt-6 flex justify-end">
                    <ArrowRight className="h-5 w-5 text-purple-400" />
                  </div>
                </motion.div>
              </Link>
              
              <Link to="/try-on" className="block">
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-dark p-8 rounded-2xl border border-pink-500/20 backdrop-blur-lg bg-slate-900/40 shadow-lg hover:shadow-pink-500/10 transition-all duration-300"
                >
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-400/20">
                    <Sparkles className="h-8 w-8 text-pink-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-pink-200">Virtual Try-On</h3>
                  <p className="text-pink-100/80">
                    See exactly how outfits look on you with our cutting-edge virtual fitting room.
                  </p>
                  <div className="mt-6 flex justify-end">
                    <ArrowRight className="h-5 w-5 text-pink-400" />
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
