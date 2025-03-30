
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { toast } from 'sonner';
import { SlidersHorizontal, ArrowLeftIcon, ShieldAlert } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserPreferences } from '@/lib/types';
import UserPreferencesForm from '@/components/preferences/UserPreferencesForm';
import { Button } from '@/components/ui/button';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Preferences = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  // Default preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteColors: ['black', 'blue', 'white'],
    favoriteStyles: ['casual', 'minimalist', 'smart casual'], // Added Smart Casual
    personalityTags: ['minimalist', 'casual'],
    seasonalPreferences: {
      spring: { 
        enabled: true, 
        temperatureRange: [10, 22],
        timeOfYear: [1, 3]
      },
      summer: { 
        enabled: true, 
        temperatureRange: [20, 35],
        timeOfYear: [1, 3]
      },
      autumn: { 
        enabled: true, 
        temperatureRange: [8, 20],
        timeOfYear: [1, 3]
      },
      winter: { 
        enabled: true, 
        temperatureRange: [-5, 10],
        timeOfYear: [1, 3]
      },
      all: { 
        enabled: true, 
        temperatureRange: [-10, 40]
      }
    },
    outfitReminders: false,
    reminderTime: '08:00',
    occasionPreferences: ['casual', 'work'],
    climatePreferences: ['temperate_oceanic'] // Updated to match new climate types
  });
  
  // If user is not logged in, redirect to home page
  if (!user) {
    toast.error("You need to be logged in to access preferences", {
      id: "auth-required",
    });
    return <Navigate to="/" replace />;
  }
  
  const handleSavePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    // In a real app, you would save these preferences to a database
    console.log('Saving preferences:', newPreferences);
    toast.success("Your preferences have been saved successfully!");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
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
          className="space-y-10 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                  <Link to="/" className="text-white/80 hover:text-white">
                    <ArrowLeftIcon className="w-5 h-5" />
                  </Link>
                </Button>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-7 w-7" />
                    Your Fashion Preferences
                  </span>
                </h1>
              </div>
            </div>

            <div className="glass-dark rounded-xl border border-white/10 p-6 space-y-6">
              <p className="text-lg text-blue-100/90">
                Set your preferences to help us provide better outfit recommendations. Your selections will be used to tailor fashion suggestions to your personal style.
              </p>
              
              <UserPreferencesForm
                initialPreferences={preferences}
                onSave={handleSavePreferences}
              />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Preferences;
