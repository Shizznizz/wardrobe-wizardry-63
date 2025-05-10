
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  text: string;
  options: { id: string; label: string }[];
}

interface QuizResult {
  styleProfile: string;
  description: string;
  image: string;
  traits: string[];
}

interface FindYourStyleQuizProps {
  standalone?: boolean;
  onComplete?: (quizResult?: QuizResult) => void;
}

const FindYourStyleQuiz: React.FC<FindYourStyleQuizProps> = ({ standalone = false, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const questions: Question[] = [
    {
      id: 'q1',
      text: 'What is your go-to weekend activity?',
      options: [
        { id: 'a', label: 'Brunch with friends' },
        { id: 'b', label: 'Exploring a new city' },
        { id: 'c', label: 'Relaxing at home with a book' },
      ],
    },
    {
      id: 'q2',
      text: 'Which color palette do you prefer?',
      options: [
        { id: 'a', label: 'Neutrals with a pop of color' },
        { id: 'b', label: 'Bold and vibrant hues' },
        { id: 'c', label: 'Soft and pastel shades' },
      ],
    },
    {
      id: 'q3',
      text: 'What is your favorite type of music?',
      options: [
        { id: 'a', label: 'Pop' },
        { id: 'b', label: 'Electronic' },
        { id: 'c', label: 'Acoustic' },
      ],
    },
  ];

  const quizResults: { [key: string]: QuizResult } = {
    'a,a,a': {
      styleProfile: 'Classic Chic',
      description: 'You appreciate timeless elegance and refined style. Your wardrobe consists of well-tailored pieces and sophisticated accessories.',
      image: '/lovable-uploads/classic-chic.jpg',
      traits: ['Elegant', 'Refined', 'Timeless'],
    },
    'b,b,b': {
      styleProfile: 'Edgy Trendsetter',
      description: 'You are always ahead of the curve, experimenting with bold silhouettes and statement pieces. Your style is daring and unconventional.',
      image: '/lovable-uploads/edgy-trendsetter.jpg',
      traits: ['Daring', 'Unconventional', 'Bold'],
    },
    'c,c,c': {
      styleProfile: 'Boho Dreamer',
      description: 'You embrace a free-spirited and eclectic aesthetic, with flowing fabrics, earthy tones, and bohemian-inspired details.',
      image: '/lovable-uploads/boho-dreamer.jpg',
      traits: ['Free-spirited', 'Eclectic', 'Earthy'],
    },
  };

  useEffect(() => {
    if (quizCompleted && !showResult) {
      setShowResult(true);
    }
  }, [quizCompleted, showResult]);

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleSubmitQuiz = () => {
    setQuizCompleted(true);
    
    if (onComplete) {
      // Pass the quiz result to the parent component
      const result = getQuizResult();
      onComplete(result);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizCompleted(false);
    setShowResult(false);
  };

  const getQuizResult = (): QuizResult => {
    const answerString = Object.values(answers).join(',');
    return quizResults[answerString] || quizResults['a,a,a'];
  };

  const handleQuizCompletion = () => {
    if (onComplete) {
      // Pass the quiz result to the parent component
      const result = getQuizResult();
      onComplete(result);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white py-12">
      <div className="container mx-auto px-4">
        {standalone && (
          <h1 className="text-3xl font-bold text-center mb-8">Find Your Style</h1>
        )}
        {!quizCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-slate-900/70 to-indigo-900/40 border-purple-500/20 shadow-xl backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Question {currentQuestionIndex + 1}</h2>
                <p className="text-lg mb-6">{questions[currentQuestionIndex].text}</p>
                <div className="space-y-4">
                  {questions[currentQuestionIndex].options.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      className={cn(
                        'w-full justify-start',
                        answers[questions[currentQuestionIndex].id] === option.id
                          ? 'bg-purple-500/20 hover:bg-purple-500/30'
                          : 'hover:bg-purple-500/10'
                      )}
                      onClick={() => handleAnswer(questions[currentQuestionIndex].id, option.id)}
                    >
                      {option.label}
                      {answers[questions[currentQuestionIndex].id] === option.id && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-between mt-6">
                  {currentQuestionIndex > 0 && (
                    <Button variant="secondary" onClick={handlePreviousQuestion}>
                      Previous
                    </Button>
                  )}
                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button onClick={handleNextQuestion}>Next</Button>
                  ) : (
                    <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-slate-900/70 to-indigo-900/40 border-purple-500/20 shadow-xl backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Your Style Profile</h2>
                <p className="text-lg mb-6">Based on your answers, your style profile is:</p>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{getQuizResult().styleProfile}</h3>
                  <p className="text-white/70">{getQuizResult().description}</p>
                </div>
                <Button onClick={resetQuiz}>Retake Quiz</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FindYourStyleQuiz;
