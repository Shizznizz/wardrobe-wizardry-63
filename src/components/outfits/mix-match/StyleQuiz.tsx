import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
// REMOVE ARROWS FROM BUTTONS, ONLY TEXT
// import { ArrowRight, Check } from 'lucide-react'; 
import { Card, CardContent } from '@/components/ui/card';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData'; // FIX NAMED IMPORTS
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

// Computes font size class based on text length (adaptive for mobile too)
const getFontSizeClass = (text: string) => {
  if (text.length > 44) return 'text-xs';
  if (text.length > 32) return 'text-sm';
  return 'text-base';
};

// Enhanced Quiz button with strong color feedback & improved text handling
function QuizOptionButton({
  children,
  selected,
  onClick,
  className,
  ...props
}: {
  children: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const span = textRef.current;
      if (span) {
        setIsOverflowing(span.scrollHeight > span.offsetHeight + 1 || span.scrollWidth > span.offsetWidth + 1);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [children]);

  // Responsive styles
  const baseSelected = "bg-gradient-to-br from-[#9b87f5] to-pink-500 text-white border-[#9b87f5]/80 shadow-md";
  const baseUnselected = "bg-white/15 hover:bg-white/20 text-white/90 border-white/10";
  const responsiveLayout = `
    flex flex-col items-center justify-center w-full min-w-0 px-3 py-3 
    rounded-xl border text-center whitespace-normal
    transition-all duration-150 relative
    min-h-12 sm:min-h-[52px] md:min-h-[56px]
  `;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={40}>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            aria-pressed={selected}
            className={`${responsiveLayout} ${selected ? baseSelected : baseUnselected}
              ${getFontSizeClass(children)} ${className || ''}`}
            variant="outline"
            style={{
              userSelect: 'none',
              maxWidth: '100%',
              paddingLeft: 16, paddingRight: 16,
              fontWeight: selected ? 700 : 500,
              lineHeight: 1.25,
              height: 'auto',
              wordBreak: 'break-word',
              boxShadow: selected ? '0 0 0 2px #9b87f555' : undefined,
            }}
            {...props}
          >
            <span
              ref={textRef}
              style={{
                width: '100%',
                display: 'block',
                whiteSpace: 'normal',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                fontSize: selected ? '1rem' : undefined, // finer tweak
                textAlign: 'center',
              }}
              className={`block py-1 px-1 leading-tight ${getFontSizeClass(children)} transition-all`}
            >
              {children}
            </span>
          </Button>
        </TooltipTrigger>
        {isOverflowing && (
          <TooltipContent
            side="top"
            className="max-w-xs break-words whitespace-pre-line text-sm font-medium"
          >
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

  // Matching based on "style" first, then "activity" as fallback, then random. Can be improved for AI integration.
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
