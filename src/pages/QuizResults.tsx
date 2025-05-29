
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { useQuizResults } from '@/services/QuizService';
import { format } from 'date-fns';

const QuizResults = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { getAllQuizResults } = useQuizResults();
  const [quizResults, setQuizResults] = useState<Record<string, any>>({});
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      loadQuizResults();
    }
  }, [user, loading, navigate]);

  const loadQuizResults = async () => {
    setLoadingResults(true);
    try {
      const results = await getAllQuizResults();
      setQuizResults(results);
    } catch (error) {
      console.error('Error loading quiz results:', error);
    } finally {
      setLoadingResults(false);
    }
  };

  const generateStyleSummary = () => {
    const allTags = new Set<string>();
    const allColors = new Set<string>();
    const allRecommendations = new Set<string>();
    
    Object.values(quizResults).forEach((result: any) => {
      if (result.resultValue?.result?.tags) {
        result.resultValue.result.tags.forEach((tag: string) => allTags.add(tag));
      }
      if (result.resultValue?.result?.colors) {
        result.resultValue.result.colors.forEach((color: string) => allColors.add(color));
      }
      if (result.resultValue?.result?.recommendations) {
        result.resultValue.result.recommendations.forEach((rec: string) => allRecommendations.add(rec));
      }
    });

    return {
      tags: Array.from(allTags),
      colors: Array.from(allColors),
      recommendations: Array.from(allRecommendations)
    };
  };

  if (loading || loadingResults) {
    return (
      <Container className="py-20 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
          <p className="text-lg text-white/70">Loading your quiz results...</p>
        </div>
      </Container>
    );
  }

  const hasResults = Object.keys(quizResults).length > 0;
  const summary = hasResults ? generateStyleSummary() : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Container className="py-10">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/quizzes')}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Style Profile
            </h1>
            <p className="text-xl text-white/80">
              Based on your completed quizzes, here's what Olivia has learned about your style
            </p>
          </div>

          {!hasResults ? (
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="p-8 text-center">
                <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-white mb-4">No Quiz Results Yet</h2>
                <p className="text-white/70 mb-6">
                  Complete some quizzes to build your personalized style profile!
                </p>
                <Button
                  onClick={() => navigate('/quizzes')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                >
                  Take Your First Quiz
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Overall Style Summary */}
              {summary && (
                <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/20">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-purple-400" />
                      Your Overall Style Profile
                    </h2>
                    
                    {summary.tags.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-white mb-3">Style Personality</h3>
                        <div className="flex flex-wrap gap-2">
                          {summary.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-purple-300 border-purple-500/30 bg-purple-900/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {summary.colors.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-white mb-3">Your Color Palette</h3>
                        <div className="flex flex-wrap gap-3">
                          {summary.colors.map((color, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div 
                                className="w-6 h-6 rounded-full border-2 border-white/20" 
                                style={{ backgroundColor: color.toLowerCase() }}
                              />
                              <span className="text-white/80 capitalize">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {summary.recommendations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-white mb-3">Olivia's Recommendations</h3>
                        <div className="space-y-2">
                          {summary.recommendations.map((rec, index) => (
                            <p key={index} className="text-white/70 bg-white/5 p-3 rounded-lg">
                              {rec}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Individual Quiz Results */}
              <div className="grid gap-6">
                <h2 className="text-2xl font-semibold text-white">Individual Quiz Results</h2>
                {Object.entries(quizResults).map(([quizId, result]) => (
                  <Card key={quizId} className="bg-slate-900/50 border-white/10">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{result.quizName}</h3>
                          <p className="text-lg text-purple-300 mt-1">{result.resultLabel}</p>
                        </div>
                        <div className="text-right text-sm text-white/50">
                          Completed {format(new Date(result.completedAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      
                      <p className="text-white/70 mb-4">
                        {result.resultValue?.result?.description}
                      </p>
                      
                      {result.resultValue?.result?.tags && (
                        <div className="flex flex-wrap gap-2">
                          {result.resultValue.result.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-blue-300 border-blue-500/30 bg-blue-900/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center pt-6">
                <Button
                  onClick={() => navigate('/profile')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                >
                  View Your Profile
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default QuizResults;
