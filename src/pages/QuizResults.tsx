
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Sparkles, Star, Palette, Calendar, Clock } from 'lucide-react';
import { getUserQuizResults, getUserPreferencesWithQuizData } from '@/services/QuizService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface QuizResultData {
  quizId: string;
  quizName: string;
  resultLabel: string;
  resultValue: any;
}

const QuizResults = () => {
  const [quizResults, setQuizResults] = useState<QuizResultData[]>([]);
  const [userPrefs, setUserPrefs] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadResults = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const [results, prefs] = await Promise.all([
          getUserQuizResults(),
          getUserPreferencesWithQuizData()
        ]);
        
        setQuizResults(results);
        setUserPrefs(prefs);
      } catch (error) {
        console.error('Error loading quiz results:', error);
        toast.error('Failed to load quiz results');
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading your style insights...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/quizzes')}
            className="mb-4 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Button>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-coral-400 via-purple-400 to-blue-400">
              Your Complete Style Profile
            </h1>
            <p className="text-white/80 text-lg">
              Here's what Olivia has learned about your unique style DNA across all your completed quizzes.
            </p>
          </div>
        </div>

        {/* Olivia's Summary */}
        <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Avatar className="h-16 w-16 border-2 border-purple-400/50 flex-shrink-0">
                <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-coral-400" />
                  Olivia's Style Summary
                </h3>
                <div className="space-y-3 text-white/80">
                  <p>
                    Based on your quiz responses, I've identified some amazing insights about your personal style! 
                    You have a wonderful blend of preferences that makes your style truly unique.
                  </p>
                  <p>
                    I'm now using these insights to personalize every outfit recommendation, wardrobe suggestion, 
                    and style tip I give you. The more I learn about you, the better I can help you look and feel amazing!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quizResults.map((result) => (
            <motion.div
              key={result.quizId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={`bg-gradient-to-br ${getQuizColor(result.quizId)} border-white/10 h-full`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-white/10">
                      {getQuizIcon(result.quizId)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{result.quizName}</h3>
                      <p className="text-white/60 text-sm">Quiz Result</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-lg font-medium text-white">{result.resultLabel}</h4>
                    
                    {/* Display key insights from result value */}
                    {result.resultValue && (
                      <div className="space-y-2">
                        {result.resultValue.keyElements && (
                          <div>
                            <p className="text-white/70 text-sm mb-1">Key Elements:</p>
                            <div className="flex flex-wrap gap-1">
                              {result.resultValue.keyElements.map((element: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-white/80 border-white/20 text-xs">
                                  {element}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {result.resultValue.preferredItems && (
                          <div>
                            <p className="text-white/70 text-sm mb-1">Preferred Items:</p>
                            <div className="flex flex-wrap gap-1">
                              {result.resultValue.preferredItems.map((item: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-white/80 border-white/20 text-xs">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {result.resultValue.occasions && (
                          <div>
                            <p className="text-white/70 text-sm mb-1">Occasions:</p>
                            <div className="flex flex-wrap gap-1">
                              {result.resultValue.occasions.map((occasion: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-white/80 border-white/20 text-xs">
                                  {occasion}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Combined Insights */}
        {userPrefs && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Your Style DNA Summary
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userPrefs.quiz_derived_styles && Object.keys(userPrefs.quiz_derived_styles).length > 0 && (
                  <div>
                    <h4 className="font-medium text-white mb-2">Style Type</h4>
                    <p className="text-coral-300 text-sm">
                      {userPrefs.quiz_derived_styles.styleType || 'Classic'}
                    </p>
                  </div>
                )}
                
                {userPrefs.quiz_derived_lifestyle && Object.keys(userPrefs.quiz_derived_lifestyle).length > 0 && (
                  <div>
                    <h4 className="font-medium text-white mb-2">Lifestyle</h4>
                    <p className="text-emerald-300 text-sm">
                      {userPrefs.quiz_derived_lifestyle.lifestyleType || 'Balanced'}
                    </p>
                  </div>
                )}
                
                {userPrefs.quiz_derived_vibes && Object.keys(userPrefs.quiz_derived_vibes).length > 0 && (
                  <div>
                    <h4 className="font-medium text-white mb-2">Vibe</h4>
                    <p className="text-amber-300 text-sm">
                      {userPrefs.quiz_derived_vibes.vibeProfile || 'Confident'}
                    </p>
                  </div>
                )}
                
                {userPrefs.quiz_derived_eras && Object.keys(userPrefs.quiz_derived_eras).length > 0 && (
                  <div>
                    <h4 className="font-medium text-white mb-2">Era Influence</h4>
                    <p className="text-blue-300 text-sm">
                      {userPrefs.quiz_derived_eras.styleHistory || 'Contemporary'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-white/70">
            Ready to see how Olivia uses these insights?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate('/my-wardrobe')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Explore My Wardrobe
            </Button>
            <Button 
              onClick={() => navigate('/mix-and-match')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Get Outfit Suggestions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
