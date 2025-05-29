
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Sparkles, Star } from 'lucide-react';
import { getUserQuizResults, getUserPreferencesWithQuizData } from '@/services/QuizService';

const AIStyleInsightsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [userPrefs, setUserPrefs] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [results, prefs] = await Promise.all([
          getUserQuizResults(),
          getUserPreferencesWithQuizData()
        ]);
        setQuizResults(results);
        setUserPrefs(prefs);
      } catch (error) {
        console.error('Error loading quiz data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const hasQuizData = quizResults.length > 0;
  
  return (
    <div className="mt-8 mb-4">
      <Card className="bg-slate-800/30 border-white/10 overflow-hidden">
        <div 
          className="p-5 bg-gradient-to-r from-purple-900/40 to-pink-900/40 flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-300" />
            <h3 className="text-white font-medium text-lg">✨ Olivia's AI-Based Style Insights</h3>
          </div>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {isOpen && (
          <div className="p-5 space-y-6">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                <p className="text-white/60 text-sm">Loading your style insights...</p>
              </div>
            ) : hasQuizData ? (
              <>
                <div>
                  <h4 className="text-white/80 font-medium mb-3">Quiz Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizResults.map((result, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h5 className="text-white font-medium text-sm mb-1">{result.quizName}</h5>
                        <p className="text-purple-300 text-sm mb-2">{result.resultLabel}</p>
                        {result.resultValue && result.resultValue.keyElements && (
                          <div className="flex flex-wrap gap-1">
                            {result.resultValue.keyElements.slice(0, 3).map((element: string, idx: number) => (
                              <Badge 
                                key={idx}
                                variant="outline" 
                                className="text-white/70 border-purple-500/30 bg-purple-900/20 text-xs"
                              >
                                {element}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {userPrefs && (
                  <div>
                    <h4 className="text-white/80 font-medium mb-3">Style DNA Summary</h4>
                    <div className="bg-slate-900/50 border border-white/10 p-4 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {userPrefs.quiz_derived_styles && Object.keys(userPrefs.quiz_derived_styles).length > 0 && (
                          <div>
                            <p className="text-white/60 text-xs mb-1">Style Type</p>
                            <p className="text-coral-300 text-sm font-medium">
                              {userPrefs.quiz_derived_styles.styleType || 'Classic'}
                            </p>
                          </div>
                        )}
                        
                        {userPrefs.quiz_derived_lifestyle && Object.keys(userPrefs.quiz_derived_lifestyle).length > 0 && (
                          <div>
                            <p className="text-white/60 text-xs mb-1">Lifestyle</p>
                            <p className="text-emerald-300 text-sm font-medium">
                              {userPrefs.quiz_derived_lifestyle.lifestyleType || 'Balanced'}
                            </p>
                          </div>
                        )}
                        
                        {userPrefs.quiz_derived_vibes && Object.keys(userPrefs.quiz_derived_vibes).length > 0 && (
                          <div>
                            <p className="text-white/60 text-xs mb-1">Vibe</p>
                            <p className="text-amber-300 text-sm font-medium">
                              {userPrefs.quiz_derived_vibes.vibeProfile || 'Confident'}
                            </p>
                          </div>
                        )}
                        
                        {userPrefs.quiz_derived_eras && Object.keys(userPrefs.quiz_derived_eras).length > 0 && (
                          <div>
                            <p className="text-white/60 text-xs mb-1">Era Influence</p>
                            <p className="text-blue-300 text-sm font-medium">
                              {userPrefs.quiz_derived_eras.styleHistory || 'Contemporary'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <Button 
                    onClick={() => window.location.href = '/quiz-results'}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    View Complete Style Profile
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4 opacity-50" />
                <h4 className="text-white font-medium mb-2">Complete Your Style Profile</h4>
                <p className="text-white/70 text-sm mb-4">
                  Take Olivia's style quizzes to unlock personalized insights and recommendations.
                </p>
                <Button 
                  onClick={() => window.location.href = '/quizzes'}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Take Style Quizzes
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AIStyleInsightsSection;
