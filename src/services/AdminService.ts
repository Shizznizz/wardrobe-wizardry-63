
import { supabase } from "@/integrations/supabase/client";

export interface AdminAnalytics {
  total_users: number;
  active_users: number;
  total_quizzes: number;
  total_outfits: number;
  quiz_breakdown: Record<string, number>;
  recent_signups: Array<{
    first_name: string;
    last_name: string;
    created_at: string;
  }>;
  popular_tags: Array<{
    tag: string;
    count: number;
  }>;
}

export interface UserStats {
  total_users: number;
  recent_signups: Array<{
    first_name: string;
    last_name: string;
    created_at: string;
  }>;
}

export interface QuizAnalytics {
  total_quizzes: number;
  quiz_breakdown: Record<string, number>;
}

export interface OutfitSummary {
  total_outfits: number;
  popular_tags: Array<{
    tag: string;
    count: number;
  }>;
}

class AdminService {
  async checkAdminStatus(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;
      
      // Check if user email is the admin email
      return user.email === 'danieldeurloo@hotmail.com';
    } catch (error) {
      console.error('Exception checking admin status:', error);
      return false;
    }
  }

  async getAnalytics(): Promise<AdminAnalytics | null> {
    try {
      const { data, error } = await supabase.rpc('get_admin_analytics');
      
      if (error) {
        console.error('Error fetching admin analytics:', error);
        return null;
      }
      
      return data as AdminAnalytics;
    } catch (error) {
      console.error('Exception fetching admin analytics:', error);
      return null;
    }
  }

  async getUserStats(): Promise<UserStats | null> {
    try {
      const { data: analytics, error } = await supabase.rpc('get_admin_analytics');
      
      if (error) {
        console.error('Error fetching user stats:', error);
        return null;
      }
      
      return {
        total_users: analytics.total_users,
        recent_signups: analytics.recent_signups
      };
    } catch (error) {
      console.error('Exception fetching user stats:', error);
      return null;
    }
  }

  async getQuizAnalytics(): Promise<QuizAnalytics | null> {
    try {
      const { data: analytics, error } = await supabase.rpc('get_admin_analytics');
      
      if (error) {
        console.error('Error fetching quiz analytics:', error);
        return null;
      }
      
      return {
        total_quizzes: analytics.total_quizzes,
        quiz_breakdown: analytics.quiz_breakdown
      };
    } catch (error) {
      console.error('Exception fetching quiz analytics:', error);
      return null;
    }
  }

  async getOutfitSummary(): Promise<OutfitSummary | null> {
    try {
      const { data: analytics, error } = await supabase.rpc('get_admin_analytics');
      
      if (error) {
        console.error('Error fetching outfit summary:', error);
        return null;
      }
      
      return {
        total_outfits: analytics.total_outfits,
        popular_tags: analytics.popular_tags
      };
    } catch (error) {
      console.error('Exception fetching outfit summary:', error);
      return null;
    }
  }

  async exportAllUserData(): Promise<void> {
    try {
      // Fetch all user data
      const [profilesRes, outfitsRes, quizResultsRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('outfits').select('*'),
        supabase.from('quiz_results').select('*')
      ]);

      if (profilesRes.error || outfitsRes.error || quizResultsRes.error) {
        throw new Error('Failed to fetch user data for export');
      }

      // Create CSV content
      const createCSV = (data: any[], filename: string) => {
        if (data.length === 0) return;
        
        const headers = Object.keys(data[0]);
        const csvContent = [
          headers.join(','),
          ...data.map(row => 
            headers.map(header => {
              const value = row[header];
              if (typeof value === 'string') {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value || '';
            }).join(',')
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      // Export each dataset
      createCSV(profilesRes.data, 'user_profiles');
      createCSV(outfitsRes.data, 'user_outfits');
      createCSV(quizResultsRes.data, 'quiz_results');

    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
