
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { userDataService } from "./UserDataService";

export interface QuizResult {
  quizId: string;
  quizName: string;
  resultLabel: string;
  resultValue: any;
}

export const saveQuizResult = async (result: QuizResult): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to save quiz results");
      return false;
    }
    
    // Save to new quiz_results table
    const saveResult = await userDataService.saveQuizResult({
      user_id: user.id,
      quiz_type: result.quizId,
      result_data: {
        quiz_name: result.quizName,
        result_label: result.resultLabel,
        ...result.resultValue
      },
      completed: true
    });

    if (!saveResult.success) {
      return false;
    }

    // Also save to existing user_quiz_results for backward compatibility
    const { error: legacyError } = await supabase
      .from('user_quiz_results')
      .upsert({
        user_id: user.id,
        quiz_id: result.quizId,
        quiz_name: result.quizName,
        result_label: result.resultLabel,
        result_value: result.resultValue
      });
      
    if (legacyError) {
      console.error("Error saving to legacy quiz results:", legacyError);
    }

    // Update user preferences based on quiz type
    await updateUserPreferencesFromQuiz(user.id, result);
    
    return true;
  } catch (error) {
    console.error("Exception saving quiz result:", error);
    toast.error("Something went wrong saving your quiz result");
    return false;
  }
};

const updateUserPreferencesFromQuiz = async (userId: string, result: QuizResult) => {
  try {
    // Get current preferences
    const { data: currentPrefs } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    let updateData: any = {};

    // Map quiz results to user preferences based on quiz type
    switch (result.quizId) {
      case 'find-your-style':
        updateData.quiz_derived_styles = result.resultValue;
        // Update favorite styles if available
        if (result.resultValue.preferredItems) {
          updateData.favorite_styles = result.resultValue.preferredItems;
        }
        break;
        
      case 'lifestyle-lens':
        updateData.quiz_derived_lifestyle = result.resultValue;
        // Update occasion preferences if available
        if (result.resultValue.occasions) {
          updateData.occasions_preferences = result.resultValue.occasions;
        }
        break;
        
      case 'vibe-check':
        updateData.quiz_derived_vibes = result.resultValue;
        // Update personality tags if available
        if (result.resultValue.keyElements) {
          updateData.personality_tags = result.resultValue.keyElements;
        }
        break;
        
      case 'fashion-time-machine':
        updateData.quiz_derived_eras = result.resultValue;
        break;
    }

    // Upsert user preferences
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...updateData
      });

    if (error) {
      console.error("Error updating user preferences:", error);
    }
  } catch (error) {
    console.error("Error updating preferences from quiz:", error);
  }
};

export const getUserQuizResults = async (): Promise<QuizResult[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    // Get from new quiz_results table first
    const quizResults = await userDataService.getUserQuizResults(user.id);
    
    if (quizResults.length > 0) {
      return quizResults.map(item => ({
        quizId: item.quiz_type,
        quizName: item.result_data.quiz_name || item.quiz_type,
        resultLabel: item.result_data.result_label || '',
        resultValue: item.result_data
      }));
    }

    // Fallback to legacy table
    const { data, error } = await supabase
      .from('user_quiz_results')
      .select('*')
      .eq('user_id', user.id);
      
    if (error) {
      console.error("Error fetching quiz results:", error);
      return [];
    }
    
    return data.map(item => ({
      quizId: item.quiz_id,
      quizName: item.quiz_name,
      resultLabel: item.result_label,
      resultValue: item.result_value
    }));
  } catch (error) {
    console.error("Exception fetching quiz results:", error);
    return [];
  }
};

export const getCompletedQuizIds = async (): Promise<string[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];
    
    return await userDataService.getCompletedQuizTypes(user.id);
  } catch (error) {
    console.error("Exception fetching completed quiz IDs:", error);
    return [];
  }
};

export const getUserPreferencesWithQuizData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      console.error("Error fetching user preferences:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception fetching user preferences:", error);
    return null;
  }
};
