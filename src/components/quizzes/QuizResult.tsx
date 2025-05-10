
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { Confetti } from '@/components/ui/confetti';
import { saveQuizResult, QuizResult as QuizResultType } from '@/services/QuizService';

interface QuizResultProps {
  title: string;
  description: string;
  traits?: string[];
  imageUrl?: string;
  quizId: string;
  quizName: string;
  resultLabel: string;
  resultValue: any;
  onSave?: () => void;
  onRetake?: () => void;
}

const QuizResult = ({
  title,
  description,
  traits = [],
  imageUrl,
  quizId,
  quizName,
  resultLabel,
  resultValue,
  onSave,
  onRetake,
}: QuizResultProps) => {
  const [showConfetti, setShowConfetti] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const handleSaveResult = async () => {
    setSaving(true);
    
    const result: QuizResultType = {
      quizId,
      quizName,
      resultLabel,
      resultValue,
    };
    
    const success = await saveQuizResult(result);
    
    setSaving(false);
    
    if (success && onSave) {
      onSave();
    }
  };

  return (
    <div className="relative">
      {showConfetti && (
        <Confetti 
          duration={2000}
          onComplete={() => setShowConfetti(false)}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            You're a <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">{title}</span>
          </h2>
          
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-6">
            {description}
          </p>
        </div>
        
        {imageUrl && (
          <div className="w-full max-w-md mx-auto mb-8 rounded-lg overflow-hidden shadow-lg border border-purple-500/20">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-auto"
            />
          </div>
        )}
        
        {traits.length > 0 && (
          <div className="bg-white/5 border border-purple-500/20 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Your Key Characteristics:</h3>
            <ul className="space-y-3">
              {traits.map((trait, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-pink-400 mt-0.5" />
                  <span className="text-white/90">{trait}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button
            onClick={handleSaveResult}
            disabled={saving}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-md"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Let Olivia Use This Info
          </Button>
          
          {onRetake && (
            <Button
              onClick={onRetake}
              variant="outline"
              className="text-white/70 border-white/10 hover:bg-white/5"
            >
              Retake Quiz
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizResult;
