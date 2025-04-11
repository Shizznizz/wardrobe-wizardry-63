
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ClothingItem, Outfit, UserPreferences } from '@/lib/types';
import { toast } from 'sonner';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';

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

// Function to save outfit log
export const saveOutfitLog = async (userId: string, log: Omit<OutfitLog, 'id'>) => {
  try {
    if (!userId) {
      console.error('No user ID provided for saving outfit log');
      return { success: false, error: 'Authentication required' };
    }

    // Prepare the outfit log data
    const outfitLogData = {
      user_id: userId,
      outfit_id: log.outfitId,
      date: log.date.toISOString(),
      time_of_day: log.timeOfDay,
      notes: log.notes || null,
      weather_condition: log.weatherCondition || null,
      temperature: log.temperature || null,
      activity: log.activity || null,
      custom_activity: log.customActivity || null,
      ai_suggested: log.aiSuggested || false
    };

    // Insert the outfit log
    const { data, error } = await supabase
      .from('outfit_logs')
      .insert(outfitLogData)
      .select()
      .single();

    if (error) {
      console.error('Error saving outfit log:', error);
      return { success: false, error };
    }

    // Convert the returned data to the application format
    const savedLog: OutfitLog = {
      id: data.id,
      outfitId: data.outfit_id,
      date: new Date(data.date),
      timeOfDay: data.time_of_day,
      notes: data.notes,
      weatherCondition: data.weather_condition,
      temperature: data.temperature,
      activity: data.activity,
      customActivity: data.custom_activity,
      aiSuggested: data.ai_suggested
    };

    return { success: true, data: savedLog };
  } catch (err) {
    console.error('Error in saveOutfitLog:', err);
    return { success: false, error: err };
  }
};

// Function to get outfit logs for a user
export const getOutfitLogs = async (userId: string) => {
  try {
    if (!userId) {
      console.error('No user ID provided for fetching outfit logs');
      return { success: false, error: 'Authentication required' };
    }

    const { data, error } = await supabase
      .from('outfit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching outfit logs:', error);
      return { success: false, error };
    }

    // Convert the database format to the application format
    const outfitLogs: OutfitLog[] = data.map(log => ({
      id: log.id,
      outfitId: log.outfit_id,
      date: new Date(log.date),
      timeOfDay: log.time_of_day,
      notes: log.notes,
      weatherCondition: log.weather_condition,
      temperature: log.temperature,
      activity: log.activity,
      customActivity: log.custom_activity,
      aiSuggested: log.ai_suggested
    }));

    return { success: true, data: outfitLogs };
  } catch (err) {
    console.error('Error in getOutfitLogs:', err);
    return { success: false, error: err };
  }
};

// Function to delete an outfit log
export const deleteOutfitLog = async (userId: string, logId: string) => {
  try {
    if (!userId || !logId) {
      console.error('Missing user ID or log ID for deleting outfit log');
      return { success: false, error: 'Missing required information' };
    }

    const { error } = await supabase
      .from('outfit_logs')
      .delete()
      .eq('id', logId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting outfit log:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error('Error in deleteOutfitLog:', err);
    return { success: false, error: err };
  }
};
