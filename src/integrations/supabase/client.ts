import { createClient } from '@supabase/supabase-js';
import { UserPreferences, Outfit, ClothingItem } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';

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
      occasionPreferences: data.occasion_preferences || [],
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

export const getOutfitLogs = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('outfit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching outfit logs:', error);
      return { success: false, error };
    }
    
    // Convert date strings to Date objects
    const formattedLogs = data.map((log: any) => ({
      ...log,
      date: new Date(log.date)
    })) as OutfitLog[];
    
    return { success: true, data: formattedLogs };
  } catch (error) {
    console.error('Exception fetching outfit logs:', error);
    return { success: false, error };
  }
};

export const saveOutfitLog = async (userId: string, log: Omit<OutfitLog, 'id'>) => {
  try {
    const logData = {
      user_id: userId,
      outfit_id: log.outfitId,
      date: log.date.toISOString(),
      time_of_day: log.timeOfDay,
      notes: log.notes || null,
      weather_condition: log.weatherCondition || null,
      temperature: log.temperature || null
    };
    
    const { data, error } = await supabase
      .from('outfit_logs')
      .insert([logData])
      .select()
      .single();
    
    if (error) {
      console.error('Error saving outfit log:', error);
      return { success: false, error };
    }
    
    // Convert the returned data to OutfitLog format
    const savedLog: OutfitLog = {
      id: data.id,
      outfitId: data.outfit_id,
      date: new Date(data.date),
      timeOfDay: data.time_of_day,
      notes: data.notes,
      weatherCondition: data.weather_condition,
      temperature: data.temperature
    };
    
    return { success: true, data: savedLog };
  } catch (error) {
    console.error('Exception saving outfit log:', error);
    return { success: false, error };
  }
};

export const updateOutfitLog = async (userId: string, logId: string, updates: Partial<OutfitLog>) => {
  try {
    // Convert OutfitLog format to database format
    const updateData: any = {};
    
    if (updates.outfitId !== undefined) updateData.outfit_id = updates.outfitId;
    if (updates.date !== undefined) updateData.date = updates.date.toISOString();
    if (updates.timeOfDay !== undefined) updateData.time_of_day = updates.timeOfDay;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.weatherCondition !== undefined) updateData.weather_condition = updates.weatherCondition;
    if (updates.temperature !== undefined) updateData.temperature = updates.temperature;
    
    const { data, error } = await supabase
      .from('outfit_logs')
      .update(updateData)
      .eq('id', logId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating outfit log:', error);
      return { success: false, error };
    }
    
    // Convert the returned data to OutfitLog format
    const updatedLog: OutfitLog = {
      id: data.id,
      outfitId: data.outfit_id,
      date: new Date(data.date),
      timeOfDay: data.time_of_day,
      notes: data.notes,
      weatherCondition: data.weather_condition,
      temperature: data.temperature
    };
    
    return { success: true, data: updatedLog };
  } catch (error) {
    console.error('Exception updating outfit log:', error);
    return { success: false, error };
  }
};

export const deleteOutfitLog = async (userId: string, logId: string) => {
  try {
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
  } catch (error) {
    console.error('Exception deleting outfit log:', error);
    return { success: false, error };
  }
};
