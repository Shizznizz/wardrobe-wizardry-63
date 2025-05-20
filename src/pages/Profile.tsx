
import React, { useState, useEffect, useCallback } from 'react';
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
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AccountSettings from '@/components/profile/AccountSettings';
import AppearanceSettings from '@/components/profile/AppearanceSettings';
import LegalInformationSettings from '@/components/profile/LegalInformationSettings';
import DataManagementSettings from '@/components/profile/DataManagementSettings';

const Profile = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [originalPreferences, setOriginalPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const isMobile = useIsMobile();
  
  // Get user preferences from database
  const fetchUserPreferences = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Get user preferences
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user preferences:', error);
        toast.error('Failed to load your profile data');
      } else {
        if (data) {
          // Transform database format to app format
          const preferences: UserPreferences = {
            favoriteColors: data.favorite_colors || [],
            favoriteStyles: data.favorite_styles || [],
            personalityTags: data.personality_tags || [],
            bodyType: data.body_type || 'not-specified',
            seasonalPreferences: data.seasonal_preferences || {
              spring: { enabled: true, temperatureRange: [10, 22] as [number, number] },
              summer: { enabled: true, temperatureRange: [20, 35] as [number, number] },
              autumn: { enabled: true, temperatureRange: [8, 20] as [number, number] },
              winter: { enabled: true, temperatureRange: [-5, 10] as [number, number] },
              all: { enabled: true, temperatureRange: [-10, 40] as [number, number] }
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
          };
          setUserPreferences(preferences);
          setOriginalPreferences(JSON.parse(JSON.stringify(preferences))); // Deep copy for comparison
        } else {
          // Set defaults if no preferences exist
          const defaults: UserPreferences = {
            favoriteColors: [],
            favoriteStyles: [],
            personalityTags: [],
            bodyType: 'not-specified',
            seasonalPreferences: {
              spring: { enabled: true, temperatureRange: [10, 22] as [number, number] },
              summer: { enabled: true, temperatureRange: [20, 35] as [number, number] },
              autumn: { enabled: true, temperatureRange: [8, 20] as [number, number] },
              winter: { enabled: true, temperatureRange: [-5, 10] as [number, number] },
              all: { enabled: true, temperatureRange: [-10, 40] as [number, number] }
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
          };
          setUserPreferences(defaults);
          setOriginalPreferences(JSON.parse(JSON.stringify(defaults))); // Deep copy for comparison
        }
      }
      
      // Also get profile details (first name, last name)
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (!profileError && profileData) {
          setUserPreferences(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              firstName: profileData.first_name || '',
              lastName: profileData.last_name || ''
            };
          });
        }
      }
    } catch (error) {
      console.error("Error in fetchUserPreferences:", error);
      toast.error("Something went wrong loading your profile");
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Get user preferences from database
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserPreferences();
    }
  }, [isAuthenticated, user, fetchUserPreferences]);
  
  // If user is not authenticated and not loading, show auth modal
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [loading, isAuthenticated]);
  
  // Check if preferences have changed
  const hasChanges = (): boolean => {
    if (!userPreferences || !originalPreferences) return false;
    return JSON.stringify(userPreferences) !== JSON.stringify(originalPreferences);
  };
  
  // Helper function to normalize tags and remove duplicates (case-insensitive)
  const normalizeTags = (tags: string[]): string[] => {
    const normalizedTags: string[] = [];
    const lowercaseTags = new Set<string>();
    
    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();
      if (!lowercaseTags.has(lowerTag)) {
        lowercaseTags.add(lowerTag);
        normalizedTags.push(tag); // Keep original case but avoid duplicates
      }
    }
    
    return normalizedTags;
  };
  
  const saveProfile = async () => {
    if (!user || !userPreferences) return false;
    
    // Validation for required fields
    if (userPreferences.firstName === '') {
      toast.error('Please enter your first name');
      return false;
    }
    
    setIsSaving(true);
    try {
      // Normalize data to prevent duplicates (case-insensitive)
      const updatedPreferences = { ...userPreferences };
      updatedPreferences.favoriteColors = normalizeTags(updatedPreferences.favoriteColors || []);
      updatedPreferences.favoriteStyles = normalizeTags(updatedPreferences.favoriteStyles || []);
      updatedPreferences.personalityTags = normalizeTags(updatedPreferences.personalityTags || []);
      updatedPreferences.occasionPreferences = normalizeTags(updatedPreferences.occasionPreferences || []);
      
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
        toast.error('Could not update your profile details');
        return false;
      }
      
      // Update state with normalized preferences
      setUserPreferences(updatedPreferences);
      setOriginalPreferences(JSON.parse(JSON.stringify(updatedPreferences))); // Update original for change comparison
      
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save profile');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const renderProfileContent = () => {
    if (!userPreferences) return null;
    
    const profileSections = [
      {
        id: "personal",
        title: "Personal Details",
        content: (
          <PersonalDetailsSection 
            preferences={userPreferences}
            setPreferences={setUserPreferences}
          />
        )
      },
      {
        id: "location",
        title: "Location",
        content: (
          <LocationSection 
            preferences={userPreferences}
            setPreferences={setUserPreferences}
          />
        )
      },
      {
        id: "style",
        title: "Style Preferences",
        content: (
          <StylePreferencesSection 
            preferences={userPreferences}
            setPreferences={setUserPreferences}
          />
        )
      },
      {
        id: "behavior",
        title: "Wardrobe Behavior",
        content: (
          <WardrobeBehaviorSection 
            preferences={userPreferences}
            setPreferences={setUserPreferences}
          />
        )
      },
      {
        id: "notifications",
        title: "Notifications",
        content: (
          <NotificationSection 
            preferences={userPreferences}
            setPreferences={setUserPreferences}
          />
        )
      },
      {
        id: "account",
        title: "Account",
        content: <AccountSettings />
      },
      {
        id: "appearance",
        title: "Appearance",
        content: <AppearanceSettings />
      },
      {
        id: "data",
        title: "Data Management",
        content: <DataManagementSettings />
      },
      {
        id: "legal",
        title: "Legal Information",
        content: <LegalInformationSettings />
      }
    ];
    
    // Render as accordions on mobile, tabs on desktop
    if (isMobile) {
      return (
        <Accordion type="single" collapsible className="w-full">
          {profileSections.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="px-4 py-2">{section.title}</AccordionTrigger>
              <AccordionContent className="p-4 space-y-4 pb-8">
                {section.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
    }
    
    // Desktop layout with tabs
    return (
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="bg-slate-800/50 border-b border-white/10 rounded-t-lg rounded-b-none w-full justify-start overflow-x-auto">
          {profileSections.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>{section.title}</TabsTrigger>
          ))}
        </TabsList>
        
        {profileSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="p-6 space-y-4">
            {section.content}
          </TabsContent>
        ))}
      </Tabs>
    );
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
      <Container className="py-10 pb-20">
        <ProfileHeader />
        
        <Card className="relative mt-6 overflow-hidden border-white/10 bg-slate-900/50 backdrop-blur-sm">
          {renderProfileContent()}
        </Card>
        
        {userPreferences && (
          <ProfileFooter
            isSaving={isSaving}
            onSave={saveProfile}
            hasChanges={hasChanges()}
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
