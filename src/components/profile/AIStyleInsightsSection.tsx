
import React, { useState } from 'react';
import { UserPreferences } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface AIStyleInsightsSectionProps {
  preferences: UserPreferences;
}

const AIStyleInsightsSection: React.FC<AIStyleInsightsSectionProps> = ({ preferences }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get quiz result data
  const quizResult = preferences.styleQuizResult || {};
  const quizCompletedDate = quizResult.completedAt ? new Date(quizResult.completedAt) : null;
  const styleSummary = quizResult.styleSummary || "Your style preferences have not been analyzed yet. Complete a style quiz to get personalized insights!";
  
  // Get color preferences
  const favoriteColors = preferences.favoriteColors || [];
  
  // Get body type and occasions
  const bodyType = preferences.bodyType || 'not-specified';
  const occasions = preferences.occasionPreferences || [];
  
  const getBodyTypeDisplay = (type: string) => {
    if (type === 'not-specified') return 'Not specified';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
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
              <h4 className="text-white/80 font-medium mb-2">Style Quiz Summary</h4>
              <div className="bg-slate-900/50 border border-white/10 p-3 rounded-md">
                <p className="text-white/70">{styleSummary}</p>
              </div>
            </div>
            
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
                  Last completed quiz: {format(quizCompletedDate, 'MMMM d, yyyy')}
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
