import { createClient } from '@supabase/supabase-js';
import { UserPreferences, Outfit, ClothingItem } from '@/lib/types';

// Set up Supabase client
export const supabase = createClient(
  'https://aaiyxtbovepseasghtth.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhaXl4dGJvdmVwc2Vhc2dodHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzcxNDMsImV4cCI6MjA1ODA1MzE0M30.Pq66ZdBT_ZEBnPbXkDe-SVMnMvqoNjcuTo05GcPabL0'
);

export const saveUserPreferences = async (userId: string, preferences: UserPreferences) => {
  try {
    console.log('Saving preferences for user:', userId);
    
    const { data: existingPrefs, error: fetchError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user preferences:', fetchError);
      return { success: false, error: fetchError };
    }
    
    let result;
    
    // Format the preferences for Supabase
    const preferencesData = {
      user_id: userId,
      favorite_colors: preferences.favoriteColors,
      favorite_styles: preferences.favoriteStyles,
      personality_tags: preferences.personalityTags,
      body_type: preferences.bodyType,
      seasonal_preferences: preferences.seasonalPreferences,
      reminder_enabled: preferences.outfitReminders,
      reminder_time: preferences.reminderTime,
      occasions_preferences: preferences.occasionPreferences,
      climate_preferences: preferences.climatePreferences,
      preferred_city: preferences.weatherLocation?.city,
      preferred_country: preferences.weatherLocation?.country,
    };
    
    if (existingPrefs) {
      // Update existing preferences
      result = await supabase
        .from('user_preferences')
        .update(preferencesData)
        .eq('user_id', userId);
    } else {
      // Insert new preferences
      result = await supabase
        .from('user_preferences')
        .insert([preferencesData]);
    }
    
    if (result.error) {
      console.error('Error saving user preferences:', result.error);
      return { success: false, error: result.error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception saving user preferences:', error);
    return { success: false, error };
  }
};

export const getUserPreferences = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user preferences:', error);
      return { success: false, error };
    }
    
    if (!data) {
      return { success: true, data: null };
    }
    
    // Convert from database format to app format
    const preferences: UserPreferences = {
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
      } : undefined
    };
    
    return { success: true, data: preferences };
  } catch (error) {
    console.error('Exception fetching user preferences:', error);
    return { success: false, error };
  }
};

// ... keep existing code for other functions
