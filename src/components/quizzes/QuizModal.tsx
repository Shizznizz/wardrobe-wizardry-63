
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuizQuestion, { QuizQuestionOption } from './QuizQuestion';
import QuizResult from './QuizResult';

export interface QuizQuestionData {
  id: string;
  question: string;
  subtext?: string;
  options: QuizQuestionOption[];
}

export interface QuizData {
  id: string;
  name: string;
  questions: QuizQuestionData[];
  getResult: (answers: Record<string, string>) => {
    title: string;
    description: string;
    traits: string[];
    imageUrl?: string;
    value: any;
  };
}

interface QuizModalProps {
  quiz: QuizData;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const QuizModal = ({ quiz, isOpen, onClose, onComplete }: QuizModalProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (optionId: string) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleSave = () => {
    if (onComplete) {
      onComplete();
    }
    onClose();
  };

  const result = showResults ? quiz.getResult(answers) : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gradient-to-br from-slate-900 to-purple-950 border-purple-500/20 p-0 max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-900 to-purple-900/90 border-b border-purple-500/20 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-pink-400/50">
              <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
              <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium text-white">{quiz.name}</h3>
              <p className="text-xs text-white/60">
                {!showResults ? `Question ${currentQuestionIndex + 1} of ${quiz.questions.length}` : 'Your Results'}
              </p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <QuizQuestion
                key={currentQuestionIndex}
                question={quiz.questions[currentQuestionIndex].question}
                subtext={quiz.questions[currentQuestionIndex].subtext}
                options={quiz.questions[currentQuestionIndex].options}
                onAnswer={handleAnswer}
                currentStep={currentQuestionIndex + 1}
                totalSteps={quiz.questions.length}
              />
            ) : result && (
              <QuizResult
                title={result.title}
                description={result.description}
                traits={result.traits}
                imageUrl={result.imageUrl}
                quizId={quiz.id}
                quizName={quiz.name}
                resultLabel={result.title}
                resultValue={result.value}
                onSave={handleSave}
                onRetake={handleReset}
              />
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
