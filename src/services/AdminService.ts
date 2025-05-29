
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

class AdminService {
  async getAnalytics(): Promise<AdminAnalytics | null> {
    try {
      const { data, error } = await supabase.rpc('get_admin_analytics');
      
      if (error) {
        console.error('Error fetching admin analytics:', error);
        toast.error('Failed to load analytics data');
        return null;
      }
      
      return data as AdminAnalytics;
    } catch (error) {
      console.error('Exception fetching admin analytics:', error);
      toast.error('Failed to load analytics data');
      return null;
    }
  }

  async checkAdminStatus(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data?.is_admin || false;
    } catch (error) {
      console.error('Exception checking admin status:', error);
      return false;
    }
  }
}

export const adminService = new AdminService();
