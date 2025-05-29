
import React, { useState, useEffect } from 'react';
import { UserPreferences } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Sparkles, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuizResults } from '@/services/QuizService';
import { useNavigate } from 'react-router-dom';

interface AIStyleInsightsSectionProps {
  preferences: UserPreferences;
}

const AIStyleInsightsSection: React.FC<AIStyleInsightsSectionProps> = ({ preferences }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quizResults, setQuizResults] = useState<Record<string, any>>({});
  const [loadingQuizData, setLoadingQuizData] = useState(false);
  const { user } = useAuth();
  const { getAllQuizResults } = useQuizResults();
  const navigate = useNavigate();
  
  // Load quiz results when component mounts or opens
  useEffect(() => {
    if (isOpen && user && Object.keys(quizResults).length === 0) {
      loadQuizData();
    }
  }, [isOpen, user]);

  const loadQuizData = async () => {
    if (!user) return;
    
    setLoadingQuizData(true);
    try {
      const results = await getAllQuizResults();
      setQuizResults(results);
    } catch (error) {
      console.error('Error loading quiz results:', error);
    } finally {
      setLoadingQuizData(false);
    }
  };
  
  // Get quiz result data from preferences or fetched results
  const quizResult = preferences.styleQuizResult || {};
  const quizCompletedDate = quizResult.completedAt ? new Date(quizResult.completedAt) : null;
  
  // Generate comprehensive style summary from all quiz results
  const generateStyleSummary = () => {
    if (Object.keys(quizResults).length === 0) {
      return "Your style preferences have not been analyzed yet. Complete style quizzes to get personalized insights from Olivia!";
    }

    const allTags = new Set<string>();
    const allDescriptions: string[] = [];
    
    Object.values(quizResults).forEach((result: any) => {
      if (result.resultValue?.result?.tags) {
        result.resultValue.result.tags.forEach((tag: string) => allTags.add(tag));
      }
      if (result.resultValue?.result?.description) {
        allDescriptions.push(`${result.quizName}: ${result.resultValue.result.description}`);
      }
    });

    let summary = `Based on your ${Object.keys(quizResults).length} completed quiz${Object.keys(quizResults).length > 1 ? 'es' : ''}, `;
    
    if (allTags.size > 0) {
      const tagArray = Array.from(allTags);
      if (tagArray.length > 3) {
        summary += `your style can be described as ${tagArray.slice(0, 3).join(', ')} and ${tagArray.length - 3} other characteristics. `;
      } else {
        summary += `your style can be described as ${tagArray.join(', ')}. `;
      }
    }
    
    summary += "Olivia uses these insights to provide personalized outfit recommendations that truly reflect your unique style personality.";
    
    return summary;
  };

  const styleSummary = generateStyleSummary();
  
  // Get color preferences
  const favoriteColors = preferences.favoriteColors || [];
  
  // Get body type and occasions
  const bodyType = preferences.bodyType || 'not-specified';
  const occasions = preferences.occasionPreferences || [];
  
  const getBodyTypeDisplay = (type: string) => {
    if (type === 'not-specified') return 'Not specified';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const hasQuizResults = Object.keys(quizResults).length > 0;
  const totalPossibleQuizzes = 4; // We have 4 quizzes total
  const completedCount = Object.keys(quizResults).length;
  
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
            {hasQuizResults && (
              <Badge variant="outline" className="text-coral-300 border-coral-500/30 bg-coral-900/20 ml-2">
                {completedCount}/{totalPossibleQuizzes} Quizzes Complete
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {isOpen && (
          <div className="p-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white/80 font-medium mb-2">Body Type</h4>
                <Badge variant="outline" className="text-white border-purple-500/30 bg-purple-900/20 py-1 px-3">
                  {getBodyTypeDisplay(bodyType)}
                </Badge>
              </div>
              
              <div>
                <h4 className="text-white/80 font-medium mb-2">Occasions You Dress For</h4>
                <div className="flex flex-wrap gap-2">
                  {occasions.length > 0 ? (
                    occasions.map((occasion, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-white border-blue-500/30 bg-blue-900/20 py-1 px-3"
                      >
                        {occasion}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-white/60 text-sm">No occasions specified</span>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white/80 font-medium">Style Quiz Analysis</h4>
                {!hasQuizResults && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/quizzes')}
                    className="text-purple-300 border-purple-500/30 hover:bg-purple-500/20"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Take Quizzes
                  </Button>
                )}
              </div>
              <div className="bg-slate-900/50 border border-white/10 p-3 rounded-md">
                {loadingQuizData ? (
                  <p className="text-white/50">Loading quiz insights...</p>
                ) : (
                  <p className="text-white/70">{styleSummary}</p>
                )}
              </div>
            </div>

            {hasQuizResults && (
              <div>
                <h4 className="text-white/80 font-medium mb-2">Completed Quizzes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(quizResults).map(([quizId, result]) => (
                    <div key={quizId} className="bg-white/5 border border-white/10 p-3 rounded-md">
                      <h5 className="text-white font-medium text-sm">{result.quizName}</h5>
                      <p className="text-purple-300 text-sm">{result.resultLabel}</p>
                      <p className="text-white/50 text-xs mt-1">
                        Completed {format(new Date(result.completedAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/quiz-results')}
                    className="text-purple-300 border-purple-500/30 hover:bg-purple-500/20"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Full Results
                  </Button>
                  {completedCount < totalPossibleQuizzes && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/quizzes')}
                      className="text-coral-300 border-coral-500/30 hover:bg-coral-500/20"
                    >
                      Complete More Quizzes
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-white/80 font-medium mb-2">Color Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {favoriteColors.length > 0 ? (
                  favoriteColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <div 
                        className="h-4 w-4 rounded-full border border-white/20" 
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      <span className="text-white/70 text-sm">{color}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-white/60 text-sm">No color preferences specified</span>
                )}
              </div>
            </div>
            
            {quizCompletedDate && (
              <div className="text-right">
                <span className="text-white/40 text-xs">
                  Profile last updated: {format(quizCompletedDate, 'MMMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AIStyleInsightsSection;
