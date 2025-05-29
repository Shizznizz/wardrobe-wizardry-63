
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { saveQuizResult } from '@/services/QuizService';

interface QuizQuestion {
  id: string;
  text: string;
  options: Array<{
    id: string;
    label: string;
    value?: string;
  }>;
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  getResult: (answers: Record<string, string>) => {
    label: string;
    description: string;
    tags: string[];
    colors?: string[];
    lifestyle?: string[];
    recommendations?: string[];
  };
}

interface QuizModalProps {
  quiz: QuizData;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quiz, isOpen, onClose, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const canProceed = answers[currentQuestion?.id];

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const quizResult = quiz.getResult(answers);
      setResult(quizResult);
      setShowResult(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleConfirmResult = async () => {
    if (!result) return;
    
    setIsSaving(true);
    try {
      const success = await saveQuizResult({
        quizId: quiz.id,
        quizName: quiz.title,
        resultLabel: result.label,
        resultValue: {
          answers,
          result,
          completedAt: new Date().toISOString()
        }
      });
      
      if (success) {
        onComplete();
        resetQuiz();
        onClose();
      }
    } catch (error) {
      console.error('Error saving quiz result:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
  };

  const handleClose = () => {
    resetQuiz();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 border-purple-500/20 shadow-xl backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">{quiz.title}</h2>
                <p className="text-white/70 text-sm mt-1">{quiz.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-purple-300 border-purple-500/30">
                      Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </Badge>
                    <div className="w-32 bg-purple-900/30 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <h3 className="text-xl font-medium text-white mb-6">
                    {currentQuestion?.text}
                  </h3>

                  <div className="space-y-3">
                    {currentQuestion?.options.map((option) => (
                      <Button
                        key={option.id}
                        variant="outline"
                        className={cn(
                          "w-full justify-start p-4 h-auto text-left border-white/10 hover:bg-white/5",
                          answers[currentQuestion.id] === option.id
                            ? "bg-purple-500/20 border-purple-500/50 text-white"
                            : "text-white/80 hover:text-white"
                        )}
                        onClick={() => handleAnswer(currentQuestion.id, option.id)}
                      >
                        <span className="flex-1">{option.label}</span>
                        {answers[currentQuestion.id] === option.id && (
                          <Check className="h-5 w-5 text-purple-400 ml-2" />
                        )}
                      </Button>
                    ))}
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button
                      variant="ghost"
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    <Button
                      onClick={handleNext}
                      disabled={!canProceed}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                    >
                      {isLastQuestion ? 'See Results' : 'Next'}
                      {!isLastQuestion && <ChevronRight className="h-4 w-4 ml-1" />}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      Your Result: {result?.label}
                    </h3>
                    <p className="text-white/70 text-lg">
                      {result?.description}
                    </p>
                  </div>

                  {result?.tags && result.tags.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Your Style Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-purple-300 border-purple-500/30 bg-purple-900/20">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result?.colors && result.colors.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Your Colors</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.colors.map((color: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-white/20" 
                              style={{ backgroundColor: color.toLowerCase() }}
                            />
                            <span className="text-white/80 text-sm capitalize">{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-6">
                    <Button
                      variant="outline"
                      onClick={resetQuiz}
                      className="flex-1 text-white border-white/20 hover:bg-white/10"
                    >
                      Retake Quiz
                    </Button>
                    <Button
                      onClick={handleConfirmResult}
                      disabled={isSaving}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                    >
                      {isSaving ? 'Saving...' : 'Save Results'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuizModal;
