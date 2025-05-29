
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { toast } from 'sonner';

interface QuizResultProps {
  title: string;
  description: string;
  traits: string[];
  imageUrl?: string;
  quizId: string;
  quizName: string;
  resultLabel: string;
  resultValue: any;
  onSave?: () => void;
  onRetake?: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({
  title,
  description,
  traits,
  imageUrl,
  quizId,
  quizName,
  resultLabel,
  resultValue,
  onSave,
  onRetake
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const { saveQuizResult } = useUserData();

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const success = await saveQuizResult({
        quiz_type: quizId,
        result_data: {
          quiz_name: quizName,
          result_label: resultLabel,
          title,
          description,
          traits,
          ...resultValue
        },
        completed: true
      });

      if (success) {
        toast.success("Your results have been saved and integrated into your profile!");
        
        // Store in localStorage as backup
        const completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
        if (!completedQuizzes.includes(quizId)) {
          completedQuizzes.push(quizId);
          localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
        }
        
        if (onSave) {
          onSave();
        }
      }
    } catch (error) {
      console.error('Error saving quiz result:', error);
      toast.error('Failed to save quiz results');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-coral-400 to-purple-500 flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Traits Section */}
      <div className="flex flex-wrap justify-center gap-3">
        {traits.map((trait, index) => (
          <Badge 
            key={index}
            className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 border-purple-500/50 px-4 py-2 text-sm font-medium"
          >
            {trait}
          </Badge>
        ))}
      </div>

      {/* Olivia's Response */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex gap-4">
        <Avatar className="h-12 w-12 border-2 border-purple-400/50 flex-shrink-0">
          <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
          <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-2">Olivia's Take:</h4>
          <p className="text-white/80 text-sm leading-relaxed">
            Perfect! I love learning more about your style. These insights will help me suggest outfits that truly reflect your personality and lifestyle. Ready to let me use this to personalize your recommendations?
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onRetake}
          className="border-white/20 text-white hover:bg-white/10 flex-1 sm:flex-none"
          disabled={isSaving}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Retake Quiz
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-coral-500 to-purple-600 hover:from-coral-600 hover:to-purple-700 text-white flex-1 sm:flex-none sm:ml-auto px-8"
        >
          {isSaving ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Let Olivia Use This Info
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default QuizResult;
