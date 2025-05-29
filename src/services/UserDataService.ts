
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Activity {
  id?: string;
  user_id: string;
  outfit_id?: string;
  date: string;
  time_of_day: string;
  weather_condition?: string;
  temperature?: string;
  activity?: string;
  ai_suggested?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface QuizResult {
  id?: string;
  user_id: string;
  quiz_type: string;
  result_data: any;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  personality_tags?: string[];
  color_scheme?: string;
  style_preferences?: any;
  theme_preference?: string;
  notification_settings?: any;
  created_at?: string;
  updated_at?: string;
}

class UserDataService {
  async createUserProfile(userId: string, profileData: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating user profile:', error);
      toast.error('Failed to create user profile');
      return { success: false, error };
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      return { success: true, data };
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update profile');
      return { success: false, error };
    }
  }

  async saveActivity(activity: Activity) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert(activity);

      if (error) throw error;
      
      toast.success('Activity saved successfully');
      return { success: true, data };
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity');
      return { success: false, error };
    }
  }

  async getUserActivities(userId: string, startDate?: string, endDate?: string) {
    try {
      let query = supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId);

      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query.order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }
  }

  async updateActivity(activityId: string, updates: Partial<Activity>) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', activityId);

      if (error) throw error;
      
      toast.success('Activity updated successfully');
      return { success: true, data };
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update activity');
      return { success: false, error };
    }
  }

  async deleteActivity(activityId: string) {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);

      if (error) throw error;
      
      toast.success('Activity deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
      return { success: false, error };
    }
  }

  async saveQuizResult(quizResult: QuizResult) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .upsert(quizResult);

      if (error) throw error;
      
      // Update profile with quiz insights
      await this.updateProfileFromQuizResults(quizResult.user_id);
      
      toast.success('Quiz results saved successfully');
      return { success: true, data };
    } catch (error) {
      console.error('Error saving quiz result:', error);
      toast.error('Failed to save quiz results');
      return { success: false, error };
    }
  }

  async getUserQuizResults(userId: string) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      return [];
    }
  }

  async getCompletedQuizTypes(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('quiz_type')
        .eq('user_id', userId)
        .eq('completed', true);

      if (error) throw error;
      return data?.map(item => item.quiz_type) || [];
    } catch (error) {
      console.error('Error fetching completed quiz types:', error);
      return [];
    }
  }

  private async updateProfileFromQuizResults(userId: string) {
    try {
      const quizResults = await this.getUserQuizResults(userId);
      
      if (quizResults.length === 0) return;

      // Aggregate insights from all quiz results
      const personalityTags: string[] = [];
      let colorScheme = '';
      const stylePreferences: any = {};

      quizResults.forEach(result => {
        if (result.result_data) {
          // Extract personality tags
          if (result.result_data.traits) {
            personalityTags.push(...result.result_data.traits);
          }
          if (result.result_data.keyElements) {
            personalityTags.push(...result.result_data.keyElements);
          }

          // Extract color preferences
          if (result.result_data.mainColors) {
            colorScheme = result.result_data.mainColors.join(', ');
          }

          // Store style preferences by quiz type
          stylePreferences[result.quiz_type] = result.result_data;
        }
      });

      // Update profile with aggregated data
      await this.updateUserProfile(userId, {
        personality_tags: [...new Set(personalityTags)], // Remove duplicates
        color_scheme: colorScheme,
        style_preferences: stylePreferences
      });

    } catch (error) {
      console.error('Error updating profile from quiz results:', error);
    }
  }

  async hydrateUserData(userId: string) {
    try {
      const [profile, activities, quizResults] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserActivities(userId),
        this.getUserQuizResults(userId)
      ]);

      return {
        profile,
        activities,
        quizResults,
        completedQuizTypes: quizResults?.filter(q => q.completed).map(q => q.quiz_type) || []
      };
    } catch (error) {
      console.error('Error hydrating user data:', error);
      return {
        profile: null,
        activities: [],
        quizResults: [],
        completedQuizTypes: []
      };
    }
  }
}

export const userDataService = new UserDataService();
