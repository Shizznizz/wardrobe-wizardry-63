
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export interface QuizResult {
  quizId: string;
  quizName: string;
  resultLabel: string;
  resultValue: any;
}

export interface QuizAnswers {
  [questionId: string]: string | string[];
}

export const saveQuizResult = async (result: QuizResult): Promise<boolean> => {
  try {
    const { user } = await supabase.auth.getSession().then(({ data }) => ({ user: data.session?.user }));
    
    if (!user) {
      toast.error("You must be logged in to save quiz results");
      return false;
    }
    
    const { error } = await supabase
      .from('user_quiz_results')
      .upsert({
        user_id: user.id,
        quiz_id: result.quizId,
        quiz_name: result.quizName,
        result_label: result.resultLabel,
        result_value: result.resultValue,
        completed_at: new Date().toISOString()
      });
      
    if (error) {
      console.error("Error saving quiz result:", error);
      toast.error("Failed to save your quiz result");
      return false;
    }
    
    toast.success(`${result.quizName} results saved successfully!`);
    return true;
  } catch (error) {
    console.error("Exception saving quiz result:", error);
    toast.error("Something went wrong saving your quiz result");
    return false;
  }
};

export const getUserQuizResults = async (): Promise<QuizResult[]> => {
  try {
    const { user } = await supabase.auth.getSession().then(({ data }) => ({ user: data.session?.user }));
    
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('user_quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });
      
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

export const getQuizResultsByIds = async (quizIds: string[]): Promise<Record<string, any>> => {
  try {
    const { user } = await supabase.auth.getSession().then(({ data }) => ({ user: data.session?.user }));
    
    if (!user) {
      return {};
    }
    
    const { data, error } = await supabase
      .from('user_quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .in('quiz_id', quizIds);
      
    if (error) {
      console.error("Error fetching quiz results by IDs:", error);
      return {};
    }
    
    const results: Record<string, any> = {};
    data.forEach(item => {
      results[item.quiz_id] = {
        resultLabel: item.result_label,
        resultValue: item.result_value,
        completedAt: item.completed_at
      };
    });
    
    return results;
  } catch (error) {
    console.error("Exception fetching quiz results by IDs:", error);
    return {};
  }
};

export const useQuizResults = () => {
  const { user } = useAuth();
  
  const getCompletedQuizIds = async (): Promise<string[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('user_quiz_results')
        .select('quiz_id')
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error fetching completed quiz IDs:", error);
        return [];
      }
      
      return data.map(item => item.quiz_id);
    } catch (error) {
      console.error("Exception fetching completed quiz IDs:", error);
      return [];
    }
  };
  
  const getAllQuizResults = async (): Promise<Record<string, any>> => {
    if (!user) return {};
    
    try {
      const { data, error } = await supabase
        .from('user_quiz_results')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error fetching all quiz results:", error);
        return {};
      }
      
      const results: Record<string, any> = {};
      data.forEach(item => {
        results[item.quiz_id] = {
          quizName: item.quiz_name,
          resultLabel: item.result_label,
          resultValue: item.result_value,
          completedAt: item.completed_at
        };
      });
      
      return results;
    } catch (error) {
      console.error("Exception fetching all quiz results:", error);
      return {};
    }
  };
  
  return { getCompletedQuizIds, getAllQuizResults };
};
