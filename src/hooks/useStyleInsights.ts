
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface StyleInsights {
  personality_tags: string[];
  style_preferences: Record<string, any>;
  color_scheme: string;
  quiz_results: any[];
}

export const useStyleInsights = () => {
  const [styleInsights, setStyleInsights] = useState<StyleInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const loadStyleInsights = async () => {
    if (!user) return null;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('personality_tags, style_preferences, color_scheme')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading style insights:', error);
        return null;
      }

      if (data) {
        const insights: StyleInsights = {
          personality_tags: data.personality_tags || [],
          style_preferences: data.style_preferences || {},
          color_scheme: data.color_scheme || '',
          quiz_results: []
        };

        // Also load quiz results
        const { data: quizData, error: quizError } = await supabase
          .from('user_quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!quizError && quizData) {
          insights.quiz_results = quizData;
        }

        setStyleInsights(insights);
        return insights;
      }
    } catch (error) {
      console.error('Error in loadStyleInsights:', error);
    } finally {
      setIsLoading(false);
    }

    return null;
  };

  useEffect(() => {
    if (user) {
      loadStyleInsights();
    }
  }, [user]);

  return {
    styleInsights,
    isLoading,
    refreshStyleInsights: loadStyleInsights
  };
};
