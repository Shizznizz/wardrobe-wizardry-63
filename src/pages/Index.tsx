import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shirt, Palette, Cloud } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.section variants={itemVariants} className="flex flex-col items-center justify-center text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Organize Your Wardrobe, Effortlessly
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl">
              Track your clothes, create outfits, and get personalized recommendations based on your style preferences and local weather.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/wardrobe">
                <Button size="lg" className="space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              
              <PreferencesModal 
                preferences={preferences} 
                onSave={handleUpdatePreferences} 
              />
            </div>
          </motion.section>
          
          <motion.section variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg border shadow-soft">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shirt className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Track Your Wardrobe</h3>
                <p className="text-muted-foreground">
                  Easily upload and categorize your clothing items to keep track of everything you own.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border shadow-soft">
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-medium mb-2">Create Stylish Outfits</h3>
                <p className="text-muted-foreground">
                  Mix and match items to create outfits for any occasion and save them for later use.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border shadow-soft">
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Cloud className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Weather Recommendations</h3>
                <p className="text-muted-foreground">
                  Get outfit suggestions based on the local weather forecast and your preferences.
                </p>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
