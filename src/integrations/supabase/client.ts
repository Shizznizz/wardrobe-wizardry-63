import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ClothingItem, Outfit, UserPreferences } from '@/lib/types';
import { toast } from 'sonner';

// Initialize Supabase client
export const supabase = createClient(
  'https://aaiyxtbovepseasghtth.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhaXl4dGJvdmVwc2Vhc2dodHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzcxNDMsImV4cCI6MjA1ODA1MzE0M30.Pq66ZdBT_ZEBnPbXkDe-SVMnMvqoNjcuTo05GcPabL0'
);

// Function to save user preferences
export const saveUserPreferences = async (userId: string, preferences: UserPreferences) => {
  try {
    // Prepare the data to be saved
    const preferencesData = {
      user_id: userId,
      favorite_colors: preferences.favoriteColors,
      favorite_styles: preferences.favoriteStyles,
      seasonal_preferences: preferences.seasonalPreferences,
      reminder_enabled: preferences.outfitReminders,
      // Convert any other fields as needed
    };

    // Upsert the user preferences (insert if not exists, update if exists)
    const { error } = await supabase
      .from('user_preferences')
      .upsert(preferencesData, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Error saving preferences:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error('Error in saveUserPreferences:', err);
    return { success: false, error: err };
  }
};

// Function to get user preferences
export const getUserPreferences = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching preferences:', error);
      
      // If the error is "No rows returned", it means the user doesn't have preferences yet
      if (error.code === 'PGRST116') {
        return { success: false, error: null, notFound: true };
      }
      
      return { success: false, error };
    }

    if (!data) {
      return { success: false, notFound: true };
    }

    // Transform the data from the database format to the application format
    const preferences: UserPreferences = {
      favoriteColors: data.favorite_colors || [],
      favoriteStyles: data.favorite_styles || [],
      seasonalPreferences: data.seasonal_preferences || {
        spring: { enabled: true, temperatureRange: [10, 22] },
        summer: { enabled: true, temperatureRange: [20, 35] },
        autumn: { enabled: true, temperatureRange: [8, 20] },
        winter: { enabled: true, temperatureRange: [-5, 10] },
        all: { enabled: true, temperatureRange: [-10, 40] }
      },
      outfitReminders: data.reminder_enabled || false,
      reminderTime: data.reminder_time || '08:00',
      // Map any other fields
    };

    return { success: true, data: preferences };
  } catch (err) {
    console.error('Error in getUserPreferences:', err);
    return { success: false, error: err };
  }
};

// Other functions can be added here later if needed
