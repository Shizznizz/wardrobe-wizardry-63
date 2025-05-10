
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import FindYourStyleQuiz from '@/components/FindYourStyleQuiz';
import { UserPreferences } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import PageHeader from '@/components/shared/PageHeader';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const StyleQuizPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Check if user is already logged in
  useEffect(() => {
    // If loading is complete and no user is authenticated, redirect to auth
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);
  
  const handleQuizComplete = async () => {
    // Default preferences if we don't get any from the quiz
    const defaultPreferences: UserPreferences = {
      favoriteColors: ['black', 'blue'],
      favoriteStyles: ['casual', 'minimalist'],
      bodyType: 'not-specified',
      personalityTags: ['minimalist', 'casual'],
      seasonalPreferences: {
        spring: { enabled: true, temperatureRange: [10, 22] },
        summer: { enabled: true, temperatureRange: [20, 35] },
        autumn: { enabled: true, temperatureRange: [8, 20] },
        winter: { enabled: true, temperatureRange: [-5, 10] },
        all: { enabled: true, temperatureRange: [-10, 40] }
      },
      outfitReminders: false,
      reminderTime: '08:00',
      occasionPreferences: ['everyday', 'work'],
      climatePreferences: ['flexible']
    };
    
    console.log('Quiz completed, using default preferences');
    
    if (user) {
      try {
        // First check if user already has preferences
        const { data: existingPrefs, error: checkError } = await supabase
          .from('user_preferences')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        // Format the preferences for Supabase
        const preferencesData = {
          user_id: user.id,
          favorite_colors: defaultPreferences.favoriteColors || [],
          favorite_styles: defaultPreferences.favoriteStyles || [],
          personality_tags: defaultPreferences.personalityTags || [],
          body_type: defaultPreferences.bodyType || 'not-specified',
          seasonal_preferences: defaultPreferences.seasonalPreferences || {},
          reminder_enabled: defaultPreferences.outfitReminders || false,
          reminder_time: defaultPreferences.reminderTime || '08:00',
          occasions_preferences: defaultPreferences.occasionPreferences || [],
          climate_preferences: defaultPreferences.climatePreferences || [],
          preferred_city: defaultPreferences.weatherLocation?.city,
          preferred_country: defaultPreferences.weatherLocation?.country,
          use_trends_global: defaultPreferences.useTrendsGlobal || true,
          use_trends_local: defaultPreferences.useTrendsLocal || true,
          use_only_wardrobe: defaultPreferences.useOnlyWardrobe || false,
          temperature_unit: defaultPreferences.temperatureUnit || 'C',
          weekly_email_updates: defaultPreferences.weeklyEmailUpdates || false,
          notify_new_outfits: defaultPreferences.notifyNewOutfits || true,
          notify_weather_changes: defaultPreferences.notifyWeatherChanges || true,
          pronouns: defaultPreferences.pronouns || 'not-specified'
        };
        
        if (existingPrefs) {
          // Update existing preferences
          const { error } = await supabase
            .from('user_preferences')
            .update(preferencesData)
            .eq('user_id', user.id);
            
          if (error) throw error;
        } else {
          // Insert new preferences
          const { error } = await supabase
            .from('user_preferences')
            .insert([preferencesData]);
            
          if (error) throw error;
        }
        
        toast.success("Your style profile has been saved!");
        // Redirect to My Wardrobe
        navigate('/my-wardrobe');
      } catch (error) {
        console.error('Error saving preferences:', error);
        toast.error("Failed to save your style profile");
      }
    } else {
      // If somehow the user is not logged in
      toast.error("Please log in to save your style preferences");
      navigate('/auth');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <main className="container mx-auto px-4">
        <PageHeader
          title="Find Your Style"
          subtitle="Let's discover your unique aesthetic together — I'll guide your style journey."
          showAvatar={true}
        />
        
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FindYourStyleQuiz 
            onComplete={handleQuizComplete} 
            standalone={true}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default StyleQuizPage;
