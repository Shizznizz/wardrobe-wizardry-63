
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import AuthRequiredModal from '@/components/shared/AuthRequiredModal';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PersonalDetailsSection from '@/components/profile/PersonalDetailsSection';
import LocationSection from '@/components/profile/LocationSection';
import StylePreferencesSection from '@/components/profile/StylePreferencesSection';
import WardrobeBehaviorSection from '@/components/profile/WardrobeBehaviorSection';
import NotificationSection from '@/components/profile/NotificationSection';
import ProfileFooter from '@/components/profile/ProfileFooter';
import { UserPreferences } from '@/lib/types';

const Profile = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Get user preferences from database
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserPreferences();
    }
  }, [isAuthenticated, user]);
  
  // If user is not authenticated and not loading, show auth modal
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [loading, isAuthenticated]);
  
  const fetchUserPreferences = async () => {
    try {
      setIsLoading(true);
      
      // Get user preferences
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user!.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user preferences:', error);
        toast.error('Failed to load your profile data');
      } else {
        if (data) {
          // Transform database format to app format
          setUserPreferences({
            favoriteColors: data.favorite_colors || [],
            favoriteStyles: data.favorite_styles || [],
            personalityTags: data.personality_tags || [],
            bodyType: data.body_type || 'not-specified',
            seasonalPreferences: data.seasonal_preferences || {
              spring: { enabled: true, temperatureRange: [10, 22] },
              summer: { enabled: true, temperatureRange: [20, 35] },
              autumn: { enabled: true, temperatureRange: [8, 20] },
              winter: { enabled: true, temperatureRange: [-5, 10] },
              all: { enabled: true, temperatureRange: [-10, 40] }
            },
            outfitReminders: data.reminder_enabled || false,
            reminderTime: data.reminder_time || '08:00',
            occasionPreferences: data.occasions_preferences || [],
            climatePreferences: data.climate_preferences || [],
            weatherLocation: data.preferred_city ? {
              city: data.preferred_city,
              country: data.preferred_country || ''
            } : undefined,
            useTrendsGlobal: data.use_trends_global !== undefined ? data.use_trends_global : true,
            useTrendsLocal: data.use_trends_local !== undefined ? data.use_trends_local : true,
            useOnlyWardrobe: data.use_only_wardrobe !== undefined ? data.use_only_wardrobe : false,
            temperatureUnit: data.temperature_unit || 'C',
            weeklyEmailUpdates: data.weekly_email_updates !== undefined ? data.weekly_email_updates : false,
            notifyNewOutfits: data.notify_new_outfits !== undefined ? data.notify_new_outfits : true,
            notifyWeatherChanges: data.notify_weather_changes !== undefined ? data.notify_weather_changes : true,
            pronouns: data.pronouns || 'not-specified'
          });
        } else {
          // Set defaults if no preferences exist
          setUserPreferences({
            favoriteColors: [],
            favoriteStyles: [],
            personalityTags: [],
            bodyType: 'not-specified',
            seasonalPreferences: {
              spring: { enabled: true, temperatureRange: [10, 22] },
              summer: { enabled: true, temperatureRange: [20, 35] },
              autumn: { enabled: true, temperatureRange: [8, 20] },
              winter: { enabled: true, temperatureRange: [-5, 10] },
              all: { enabled: true, temperatureRange: [-10, 40] }
            },
            outfitReminders: false,
            reminderTime: '08:00',
            occasionPreferences: [],
            climatePreferences: [],
            useTrendsGlobal: true,
            useTrendsLocal: true,
            useOnlyWardrobe: false,
            temperatureUnit: 'C',
            weeklyEmailUpdates: false,
            notifyNewOutfits: true,
            notifyWeatherChanges: true,
            pronouns: 'not-specified'
          });
        }
      }
    } catch (error) {
      console.error("Error in fetchUserPreferences:", error);
      toast.error("Something went wrong loading your profile");
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveProfile = async (updatedPreferences: UserPreferences) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Convert preferences to database format
      const preferencesData = {
        user_id: user.id,
        favorite_colors: updatedPreferences.favoriteColors || [],
        favorite_styles: updatedPreferences.favoriteStyles || [],
        personality_tags: updatedPreferences.personalityTags || [],
        body_type: updatedPreferences.bodyType || 'not-specified',
        seasonal_preferences: updatedPreferences.seasonalPreferences || {},
        reminder_enabled: updatedPreferences.outfitReminders || false,
        reminder_time: updatedPreferences.reminderTime || '08:00',
        occasions_preferences: updatedPreferences.occasionPreferences || [],
        climate_preferences: updatedPreferences.climatePreferences || [],
        preferred_city: updatedPreferences.weatherLocation?.city,
        preferred_country: updatedPreferences.weatherLocation?.country,
        use_trends_global: updatedPreferences.useTrendsGlobal,
        use_trends_local: updatedPreferences.useTrendsLocal,
        use_only_wardrobe: updatedPreferences.useOnlyWardrobe,
        temperature_unit: updatedPreferences.temperatureUnit || 'C',
        weekly_email_updates: updatedPreferences.weeklyEmailUpdates,
        notify_new_outfits: updatedPreferences.notifyNewOutfits,
        notify_weather_changes: updatedPreferences.notifyWeatherChanges,
        pronouns: updatedPreferences.pronouns || 'not-specified'
      };

      // Check if user has preferences record
      const { data: existingPrefs, error: checkError } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      let saveError;
      if (existingPrefs) {
        // Update existing preferences
        const { error } = await supabase
          .from('user_preferences')
          .update(preferencesData)
          .eq('user_id', user.id);
        
        saveError = error;
      } else {
        // Create new preferences
        const { error } = await supabase
          .from('user_preferences')
          .insert([preferencesData]);
        
        saveError = error;
      }
      
      if (saveError) {
        console.error('Error saving preferences:', saveError);
        toast.error('Could not save your profile');
        return false;
      }
      
      // Also save profile information (name, pronouns) in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: updatedPreferences.firstName,
          last_name: updatedPreferences.lastName,
          pronouns: updatedPreferences.pronouns
        })
        .eq('id', user.id);
      
      if (profileError) {
        console.error('Error updating profile:', profileError);
      }
      
      setUserPreferences(updatedPreferences);
      toast.success('Profile updated successfully!');
      
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save profile');
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading || isLoading) {
    return (
      <Container className="py-10 min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="h-10 w-10 animate-spin text-purple-500" />
          <p className="text-lg text-white/70">Loading your profile...</p>
        </div>
      </Container>
    );
  }
  
  return (
    <>
      <Container className="py-10">
        <ProfileHeader />
        
        <Card className="relative mt-6 overflow-hidden border-white/10 bg-slate-900/50 backdrop-blur-sm">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="bg-slate-800/50 border-b border-white/10 rounded-t-lg rounded-b-none w-full justify-start overflow-x-auto">
              <TabsTrigger value="personal">Personal Details</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="style">Style Preferences</TabsTrigger>
              <TabsTrigger value="behavior">Wardrobe Behavior</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="p-6 space-y-4">
              {userPreferences && (
                <PersonalDetailsSection 
                  preferences={userPreferences}
                  setPreferences={setUserPreferences}
                />
              )}
            </TabsContent>
            
            <TabsContent value="location" className="p-6 space-y-4">
              {userPreferences && (
                <LocationSection 
                  preferences={userPreferences}
                  setPreferences={setUserPreferences}
                />
              )}
            </TabsContent>
            
            <TabsContent value="style" className="p-6 space-y-4">
              {userPreferences && (
                <StylePreferencesSection 
                  preferences={userPreferences}
                  setPreferences={setUserPreferences}
                />
              )}
            </TabsContent>
            
            <TabsContent value="behavior" className="p-6 space-y-4">
              {userPreferences && (
                <WardrobeBehaviorSection 
                  preferences={userPreferences}
                  setPreferences={setUserPreferences}
                />
              )}
            </TabsContent>
            
            <TabsContent value="notifications" className="p-6 space-y-4">
              {userPreferences && (
                <NotificationSection 
                  preferences={userPreferences}
                  setPreferences={setUserPreferences}
                />
              )}
            </TabsContent>
          </Tabs>
        </Card>
        
        {userPreferences && (
          <ProfileFooter
            isSaving={isSaving}
            onSave={() => saveProfile(userPreferences)}
          />
        )}
      </Container>
      
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => navigate('/')}
        title="Login Required"
        description="You must be logged in to access your profile."
      />
    </>
  );
};

export default Profile;
