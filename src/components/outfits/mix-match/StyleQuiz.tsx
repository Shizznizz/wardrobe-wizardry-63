
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import OliviaRecommendationAfterQuiz from './OliviaRecommendationAfterQuiz';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

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

// Utility to dynamically adjust font size based on text length
const getFontSizeClass = (text: string) => {
  if (text.length > 28) return 'text-xs';
  if (text.length > 20) return 'text-sm';
  return 'text-base';
};

function QuizOptionButton({
  children,
  selected,
  onClick,
  leftIcon,
  className,
  ...props
}: {
  children: string;
  selected: boolean;
  onClick: () => void;
  leftIcon: React.ReactNode;
  className?: string;
}) {
  // Detect if the text is overflowing the button to trigger a tooltip
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const span = textRef.current;
      if (span) {
        setIsOverflowing(span.scrollHeight > span.offsetHeight + 2);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [children]);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            aria-pressed={selected}
            className={`
              flex flex-col min-h-12 w-full min-w-0 py-3 px-4 items-center justify-center gap-2 rounded-lg truncate
              whitespace-normal border transition-all relative
              ${selected
                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border-purple-400'
                : 'bg-white/5 hover:bg-white/10 text-white/90 border-white/10'
              }
              ${getFontSizeClass(children)}
              ${className || ''}
            `}
            variant="outline"
            style={{
              maxWidth: '100%',
              overflow: 'visible', // allow button to expand down, but not side
              textOverflow: 'clip',
              lineHeight: 1.22,
              minHeight: 48,
              height: 'auto',
              wordBreak: 'break-word',
              whiteSpace: 'normal'
            }}
            {...props}
          >
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center mb-1 shrink-0
                ${selected ? 'bg-white/20' : 'bg-white/10'}
              `}
            >
              {leftIcon}
            </div>
            {/* Use break-all to wrap long words, and set max height for text to allow tooltip for overflow */}
            <span
              ref={textRef}
              className={`truncate text-center leading-tight px-1 w-full max-w-full break-words block ${getFontSizeClass(children)}`}
              style={{
                display: 'block',
                maxWidth: '100%',
                overflowWrap: 'break-word',
                // Set max height roughly for 2 lines so tooltip triggers on overflow
                maxHeight: 40,
                minHeight: 16,
                whiteSpace: 'normal',
              }}
            >
              {children}
            </span>
          </Button>
        </TooltipTrigger>
        {isOverflowing && (
          <TooltipContent side="top" className="max-w-xs break-words">
            {children}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

const StyleQuiz = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendedOutfit, setRecommendedOutfit] = useState(null);

  const findRecommendedOutfit = (answers) => {
    let match;
    if (answers.style) {
      match = sampleOutfits.find(
        o => o.tags && o.tags.some(t =>
          t.toLowerCase().includes(answers.style.split(' ')[0].toLowerCase()))
      );
    }
    if (!match && answers.activity) {
      match = sampleOutfits.find(
        o => o.tags && o.tags.some(t =>
          t.toLowerCase().includes(answers.activity.split(' ')[0].toLowerCase()))
      );
    }
    if (!match) {
      const idx = Math.floor(Math.random() * sampleOutfits.length);
      match = sampleOutfits[idx];
    }
    return match;
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: answer
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const outfit = findRecommendedOutfit(newAnswers);
      setRecommendedOutfit(outfit ?? null);
      setShowRecommendation(true);
      if (onComplete) onComplete(newAnswers);
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
        <AnimatePresence mode="wait">
          {!showRecommendation ? (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                {currentQ.question}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentQ.options.map((option) => {
                  const isSelected = answers[currentQ.id] === option;
                  return (
                    <QuizOptionButton
                      key={option}
                      selected={isSelected}
                      onClick={() => handleAnswer(option)}
                      leftIcon={isSelected
                        ? <Check className="h-4 w-4 text-white" />
                        : <ArrowRight className="h-4 w-4 text-white/80" />
                      }
                    >
                      {option}
                    </QuizOptionButton>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <OliviaRecommendationAfterQuiz
              quizAnswers={answers}
              outfit={recommendedOutfit}
              clothingItems={sampleClothingItems}
            />
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default StyleQuiz;
