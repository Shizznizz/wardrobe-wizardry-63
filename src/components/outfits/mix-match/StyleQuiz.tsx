
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import sampleOutfits from '@/lib/wardrobeData'; // Assumes export
import sampleClothingItems from '@/lib/wardrobeData'; // Assumes export
import OliviaRecommendationAfterQuiz from './OliviaRecommendationAfterQuiz';

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

const StyleQuiz = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // Show recommendation after quiz
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendedOutfit, setRecommendedOutfit] = useState(null);

  // Best-fit outfit recommender: naive match, but can expand later
  const findRecommendedOutfit = (answers) => {
    // Example: filter by "style", "activity" or fallback to random sample
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
      // Quiz complete: run recommendation
      const outfit = findRecommendedOutfit(newAnswers);
      setRecommendedOutfit(outfit ?? null);
      setShowRecommendation(true);
      if (onComplete) onComplete(newAnswers); // preserve legacy
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
        {/* Quiz questions and recommendation */}
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
                  <Button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`flex flex-col h-[48px] sm:h-[56px] w-full min-w-0 py-3 px-3 text-sm font-medium items-center justify-center gap-2 rounded-lg
                      transition-all border
                      truncate whitespace-nowrap
                      ${
                        isSelected
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border-purple-400'
                          : 'bg-white/5 hover:bg-white/10 text-white/90 border-white/10'
                      }`}
                    variant="outline"
                    style={{
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      height: 'auto'
                    }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 shrink-0
                        ${isSelected ? 'bg-white/20' : 'bg-white/10'}
                      `}
                    >
                      {isSelected ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <ArrowRight className="h-4 w-4 text-white/80" />
                      )}
                    </div>
                    <span
                      className="truncate text-center text-base leading-tight px-1"
                      style={{ width: "100%" }}
                    >
                      {option}
                    </span>
                  </Button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          // Olivia's recommendation, AI-chosen from wardrobe
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
