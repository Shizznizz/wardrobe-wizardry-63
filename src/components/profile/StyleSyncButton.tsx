
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sync, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPreferences } from '@/lib/types';

interface StyleSyncButtonProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences | null>>;
}

const StyleSyncButton = ({ preferences, setPreferences }: StyleSyncButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasQuizResults, setHasQuizResults] = useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    checkQuizResults();
  }, [user]);

  const checkQuizResults = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_quiz_results')
        .select('quiz_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setHasQuizResults(data && data.length > 0);
    } catch (error) {
      console.error('Error checking quiz results:', error);
    }
  };

  const syncWithQuizResults = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.error('No quiz results found to sync');
        return;
      }

      // Process quiz results and update preferences
      const updatedPreferences = { ...preferences };
      let syncCount = 0;

      data.forEach((result) => {
        const resultValue = result.result_value;
        
        switch (result.quiz_id) {
          case 'find-your-style':
            if (resultValue.preferredItems) {
              const newStyles = resultValue.preferredItems.filter(
                (item: string) => !updatedPreferences.favoriteStyles?.includes(item)
              );
              updatedPreferences.favoriteStyles = [
                ...(updatedPreferences.favoriteStyles || []),
                ...newStyles
              ];
              syncCount += newStyles.length;
            }
            if (resultValue.keyElements) {
              const newTags = resultValue.keyElements.filter(
                (tag: string) => !updatedPreferences.personalityTags?.includes(tag)
              );
              updatedPreferences.personalityTags = [
                ...(updatedPreferences.personalityTags || []),
                ...newTags
              ];
              syncCount += newTags.length;
            }
            break;
            
          case 'lifestyle-lens':
            if (resultValue.occasions) {
              const newOccasions = resultValue.occasions.filter(
                (occasion: string) => !updatedPreferences.occasionPreferences?.includes(occasion)
              );
              updatedPreferences.occasionPreferences = [
                ...(updatedPreferences.occasionPreferences || []),
                ...newOccasions
              ];
              syncCount += newOccasions.length;
              
              // Auto-adjust wardrobe behavior for Active Explorer
              if (resultValue.lifestyleType === 'Active Explorer') {
                updatedPreferences.useTrendsLocal = true;
              }
            }
            break;
            
          case 'vibe-check':
            if (resultValue.keyElements) {
              const newVibes = resultValue.keyElements.filter(
                (element: string) => !updatedPreferences.personalityTags?.includes(element)
              );
              updatedPreferences.personalityTags = [
                ...(updatedPreferences.personalityTags || []),
                ...newVibes
              ];
              syncCount += newVibes.length;
              
              // Auto-adjust for balance/comfort preferences
              if (resultValue.keyElements.some((elem: string) => 
                elem.toLowerCase().includes('balance') || elem.toLowerCase().includes('comfort')
              )) {
                updatedPreferences.useOnlyWardrobe = true;
              }
            }
            break;
            
          case 'fashion-time-machine':
            if (resultValue.eraStyle) {
              const eraTag = `${resultValue.eraStyle} Era`;
              if (!updatedPreferences.personalityTags?.includes(eraTag)) {
                updatedPreferences.personalityTags = [
                  ...(updatedPreferences.personalityTags || []),
                  eraTag
                ];
                syncCount++;
              }
            }
            break;
        }
      });

      setPreferences(updatedPreferences);
      
      if (syncCount > 0) {
        toast.success(`Successfully synced ${syncCount} items from your quiz results!`, {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        });
      } else {
        toast.info('All quiz insights are already synced with your profile');
      }
      
    } catch (error) {
      console.error('Error syncing quiz results:', error);
      toast.error('Failed to sync quiz results');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasQuizResults) return null;

  return (
    <Button
      onClick={syncWithQuizResults}
      disabled={isLoading}
      variant="outline"
      className="mb-4 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sync className="mr-2 h-4 w-4" />
      )}
      {isLoading ? 'Syncing...' : 'Sync with Style Profile'}
    </Button>
  );
};

export default StyleSyncButton;
