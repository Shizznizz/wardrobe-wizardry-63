
import { supabase } from '@/integrations/supabase/client';

export type OutfitActionType = 'tried' | 'shared' | 'liked';

/**
 * Track an outfit interaction in Supabase
 * @param outfitId The ID of the outfit being interacted with
 * @param actionType The type of interaction (tried, shared, liked)
 * @returns Promise that resolves when tracking is complete
 */
export const trackOutfitUsage = async (outfitId: string, actionType: OutfitActionType): Promise<boolean> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No user logged in, skipping usage tracking');
      return false;
    }
    
    // Record the interaction
    const { error } = await supabase
      .from('outfit_usage')
      .insert({
        user_id: user.id,
        outfit_id: outfitId,
        action_type: actionType,
        timestamp: new Date().toISOString()
      });
      
    if (error) {
      console.error('Error tracking outfit usage:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception tracking outfit usage:', err);
    return false;
  }
};
