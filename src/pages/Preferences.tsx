
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { toast } from 'sonner';
import { SlidersHorizontal, ArrowLeftIcon, ShieldAlert, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserPreferences, ClothingColor } from '@/lib/types';
import UserPreferencesForm from '@/components/preferences/UserPreferencesForm';
import { Button } from '@/components/ui/button';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { saveUserPreferences, getUserPreferences } from '@/integrations/supabase/client';

const Preferences = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Default preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteColors: ['black', 'blue', 'white'] as ClothingColor[],
    favoriteStyles: ['casual', 'minimalist', 'smart casual'],
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
    climatePreferences: ['temperate_oceanic']
  });
  
  // Load user preferences when component mounts
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { success, data, error } = await getUserPreferences(user.id);
        
        if (success && data) {
          console.log("Loaded preferences:", data);
          // Ensure proper type casting from API data to our UserPreferences type
          setPreferences({
            ...data,
            favoriteColors: data.favoriteColors as ClothingColor[],
          });
        } else if (error) {
          console.error("Error loading preferences:", error);
          toast.error("Failed to load your preferences");
        }
      } catch (err) {
        console.error("Error loading preferences:", err);
        toast.error("An error occurred while loading your preferences");
      } finally {
        setLoading(false);
      }
    };
    
    loadUserPreferences();
  }, [user]);
  
  // If user is not logged in, redirect to auth page
  if (!user) {
    toast.error("You need to be logged in to access preferences", {
      id: "auth-required",
    });
    return <Navigate to="/auth" replace />;
  }
  
  const handleSavePreferences = async (newPreferences: UserPreferences) => {
    try {
      // Update local state with proper type casting
      setPreferences(newPreferences);
      
      console.log("Saving preferences:", newPreferences);
      
      // Save to Supabase
      const { success, error } = await saveUserPreferences(user.id, newPreferences);
      
      if (success) {
        toast.success("Your preferences have been saved successfully!");
      } else {
        console.error("Error saving preferences:", error);
        toast.error("Failed to save your preferences");
      }
    } catch (err) {
      console.error("Error saving preferences:", err);
      toast.error("An error occurred while saving your preferences");
    }
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
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
                  <p className="text-lg text-blue-100/90">Loading your preferences...</p>
                </div>
              ) : (
                <>
                  <p className="text-lg text-blue-100/90">
                    Set your preferences to help us provide better outfit recommendations. Your selections will be used to tailor fashion suggestions to your personal style.
                  </p>
                  
                  <UserPreferencesForm
                    initialPreferences={preferences}
                    onSave={handleSavePreferences}
                  />
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Preferences;
