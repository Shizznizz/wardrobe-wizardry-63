
import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface QuizProps {
  onComplete: (answers: Record<string, string>) => void;
}

const questions = [
  {
    id: 'mood',
    question: "What's your mood today?",
    options: ['Happy', 'Chill', 'Adventurous', 'Energized', 'Cozy', 'Creative', 'Playful']
  },
  {
    id: 'destination',
    question: "Where are you heading?",
    options: ['Casual outing', 'Date night', 'Meeting', 'Night out', 'Grocery run', 'Beach day', 'Gym session']
  },
  {
    id: 'newness',
    question: "How do you feel about trying something new today?",
    options: ["I'm feeling bold", "I prefer my usual", "I'm open to surprises"]
  },
  {
    id: 'style',
    question: "What type of outfit are you looking for?",
    options: ['Cozy & comfy', 'Bold & trendy', 'Smart & professional', 'Chic & stylish', 'Fun & casual']
  },
  {
    id: 'activity',
    question: "What's your activity today?",
    options: ['Coffee with friends', 'Date night', 'Business meeting', 'Weekend getaway', 'Fitness session']
  },
  {
    id: 'feeling',
    question: "How do you want to feel in your outfit today?",
    options: ['Confident', 'Relaxed', 'Comfortable', 'Glamorous', 'Powerful', 'Fun']
  },
  {
    id: 'comfort',
    question: "Ready to step out of your comfort zone today?",
    options: ['Yes, surprise me!', 'I like to stick with what I know', "Let's try something new but safe"]
  }
];

const StyleQuiz = ({ onComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const handleAnswer = (answer: string) => {
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: answer
    };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const currentQ = questions[currentQuestion];
  
  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-purple-900/60 border-white/10">
      <CardContent className="p-6 space-y-6">
        <div className="flex space-x-1 mb-4">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx === currentQuestion 
                  ? 'bg-purple-500' 
                  : idx < currentQuestion 
                    ? 'bg-blue-600' 
                    : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            {currentQ.question}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {currentQ.options.map((option) => {
              const isSelected = answers[currentQ.id] === option;
              
              return (
                <Button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`flex flex-col h-auto py-4 px-2 text-sm items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border-purple-400'
                      : 'bg-white/5 hover:bg-white/10 text-white/90 border-white/10'
                  }`}
                  variant="outline"
                >
                  <div className={`w-8 h-8 rounded-full ${
                    isSelected ? 'bg-white/20' : 'bg-white/10'
                  } flex items-center justify-center mb-1`}>
                    {isSelected ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-white/80" />
                    )}
                  </div>
                  <span>{option}</span>
                </Button>
              );
            })}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default StyleQuiz;
