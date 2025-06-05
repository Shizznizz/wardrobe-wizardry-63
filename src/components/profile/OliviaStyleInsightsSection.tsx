
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sparkles, Palette, Calendar, Star, Clock, Check, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QuizResult {
  quiz_id: string;
  quiz_name: string;
  result_label: string;
  result_value: any;
  created_at: string;
}

const OliviaStyleInsightsSection = () => {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchQuizResults();
    }
  }, [user]);

  const fetchQuizResults = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setQuizResults(data || []);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveStyleInsights = async () => {
    if (!user || quizResults.length === 0) return;

    setIsSaving(true);
    try {
      // Aggregate all quiz insights
      const styleInsights = {
        quiz_results: quizResults.map(result => ({
          quiz_id: result.quiz_id,
          quiz_name: result.quiz_name,
          result_label: result.result_label,
          result_value: result.result_value,
          completed_at: result.created_at
        })),
        personality_tags: [],
        style_preferences: {},
        color_scheme: '',
        updated_at: new Date().toISOString()
      };

      // Extract insights from each quiz
      quizResults.forEach(result => {
        if (result.result_value) {
          // Extract personality tags
          if (result.result_value.keyElements) {
            styleInsights.personality_tags.push(...result.result_value.keyElements);
          }
          if (result.result_value.traits) {
            styleInsights.personality_tags.push(...result.result_value.traits);
          }
          if (result.result_value.preferredItems) {
            styleInsights.personality_tags.push(...result.result_value.preferredItems);
          }

          // Store quiz-specific preferences
          styleInsights.style_preferences[result.quiz_id] = result.result_value;

          // Extract color preferences
          if (result.result_value.mainColors) {
            styleInsights.color_scheme = result.result_value.mainColors.join(', ');
          }
        }
      });

      // Remove duplicates from personality tags
      styleInsights.personality_tags = [...new Set(styleInsights.personality_tags)];

      // Update the profiles table with style insights
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          personality_tags: styleInsights.personality_tags,
          color_scheme: styleInsights.color_scheme,
          style_preferences: styleInsights.style_preferences,
          updated_at: styleInsights.updated_at
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Show success message with animation
      toast.success("✨ Olivia will now use your style profile!", {
        description: "Your style insights have been saved and will influence recommendations across the platform.",
        duration: 4000,
        icon: <Check className="h-5 w-5 text-green-500" />
      });

    } catch (error) {
      console.error('Error saving style insights:', error);
      toast.error('Failed to save style insights. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getQuizIcon = (quizId: string) => {
    switch (quizId) {
      case 'find-your-style': return <Palette className="h-5 w-5" />;
      case 'lifestyle-lens': return <Calendar className="h-5 w-5" />;
      case 'vibe-check': return <Sparkles className="h-5 w-5" />;
      case 'fashion-time-machine': return <Clock className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getQuizColor = (quizId: string) => {
    switch (quizId) {
      case 'find-your-style': return 'from-purple-500/30 to-indigo-500/30';
      case 'lifestyle-lens': return 'from-emerald-500/30 to-teal-500/30';
      case 'vibe-check': return 'from-amber-500/30 to-orange-500/30';
      case 'fashion-time-machine': return 'from-blue-500/30 to-cyan-500/30';
      default: return 'from-gray-500/30 to-gray-600/30';
    }
  };

  const getOliviaQuote = (quizId: string, resultValue: any) => {
    switch (quizId) {
      case 'find-your-style':
        return "I love your style preferences! I'll use these to create looks that truly reflect who you are.";
      case 'lifestyle-lens':
        return "Understanding your lifestyle helps me suggest outfits that fit perfectly into your daily routine.";
      case 'vibe-check':
        return "Your vibe is everything! I'll make sure every outfit recommendation captures your unique energy.";
      case 'fashion-time-machine':
        return "Your era preferences add such character to your style. I'll blend those influences beautifully!";
      default:
        return "Every detail you share helps me become a better stylist for you!";
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-slate-700 rounded w-48"></div>
        <div className="h-32 bg-slate-800 rounded"></div>
      </div>
    );
  }

  // Only show if all 4 quizzes are completed
  const requiredQuizzes = ['find-your-style', 'lifestyle-lens', 'vibe-check', 'fashion-time-machine'];
  const completedQuizIds = quizResults.map(r => r.quiz_id);
  const allQuizzesCompleted = requiredQuizzes.every(quiz => completedQuizIds.includes(quiz));

  if (!allQuizzesCompleted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-coral-400" />
            Olivia's Style Insights
          </h3>
          <p className="text-white/70 text-sm mb-4">
            Based on your completed style quizzes, here's what I've learned about your unique style DNA.
          </p>
        </div>
        
        <Button 
          onClick={saveStyleInsights}
          disabled={isSaving}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Style Insights
            </>
          )}
        </Button>
      </div>

      {/* Olivia's Summary */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-12 w-12 border-2 border-purple-400/50 flex-shrink-0">
              <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
              <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium text-white mb-2">Olivia's Personal Note</h4>
              <p className="text-white/80 text-sm">
                I've analyzed all your style preferences and I'm so excited to work with you! 
                Your unique combination of tastes gives us endless possibilities for amazing outfits. 
                I'm using every insight to make sure my recommendations feel authentically you!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizResults.map((result) => (
          <Card key={result.quiz_id} className={`bg-gradient-to-br ${getQuizColor(result.quiz_id)} border-white/10`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                {getQuizIcon(result.quiz_id)}
                {result.quiz_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <h5 className="font-medium text-white text-sm">{result.result_label}</h5>
              
              {/* Display key insights from result value */}
              {result.result_value && (
                <div className="space-y-2">
                  {result.result_value.keyElements && (
                    <div className="flex flex-wrap gap-1">
                      {result.result_value.keyElements.slice(0, 3).map((element: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-white/80 border-white/20 text-xs">
                          {element}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {result.result_value.preferredItems && (
                    <div className="flex flex-wrap gap-1">
                      {result.result_value.preferredItems.slice(0, 2).map((item: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-white/80 border-white/20 text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-white/70 text-xs italic">
                "{getOliviaQuote(result.quiz_id, result.result_value)}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OliviaStyleInsightsSection;
