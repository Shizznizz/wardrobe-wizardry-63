
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Sparkles, Umbrella, Sunset, Moon, Check, ArrowRight, X } from 'lucide-react';
import { Party } from '@/components/ui/icons';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import QuizQuestion from './QuizQuestion';
import OutfitSuggestion from './OutfitSuggestion';

interface StyleDiscoveryQuizProps {
  onClose?: () => void;
}

const StyleDiscoveryQuiz = ({ onClose }: StyleDiscoveryQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showQuiz, setShowQuiz] = useState(false);
  
  const questions = [
    {
      id: 'mood',
      question: "How are you feeling today?",
      options: [
        { value: 'energetic', label: 'Energetic', icon: Sparkles },
        { value: 'relaxed', label: 'Relaxed', icon: Sunset },
        { value: 'focused', label: 'Focused', icon: Coffee },
        { value: 'playful', label: 'Playful', icon: Party },
      ],
    },
    {
      id: 'weather',
      question: "What's the weather like?",
      options: [
        { value: 'sunny', label: 'Sunny', icon: Sunset },
        { value: 'rainy', label: 'Rainy', icon: Umbrella },
        { value: 'cloudy', label: 'Cloudy', icon: Moon },
        { value: 'mixed', label: 'Mixed', icon: Coffee },
      ],
    },
    {
      id: 'occasion',
      question: "What's your main activity today?",
      options: [
        { value: 'work', label: 'Work', icon: Coffee },
        { value: 'casual', label: 'Casual Hangout', icon: Sunset },
        { value: 'date', label: 'Date Night', icon: Moon },
        { value: 'party', label: 'Party', icon: Party },
      ],
    },
  ];
  
  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
    setCurrentStep(currentStep + 1);
  };
  
  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
  };
  
  const toggleQuiz = () => {
    setShowQuiz(!showQuiz);
    setCurrentStep(0);
    setAnswers({});
  };
  
  const getOutfitSuggestion = () => {
    // This would ideally use more sophisticated logic based on answers
    // For now using a simple mapping for demo purposes
    const moodOutfits: Record<string, string> = {
      'energetic': 'vibrant athleisure',
      'relaxed': 'comfortable casual',
      'focused': 'business casual',
      'playful': 'fun and colorful'
    };
    
    const weatherOutfits: Record<string, string> = {
      'sunny': 'light and airy',
      'rainy': 'waterproof and practical',
      'cloudy': 'layers and textures',
      'mixed': 'versatile and adaptable'
    };
    
    const occasionOutfits: Record<string, string> = {
      'work': 'professional and polished',
      'casual': 'effortless and comfortable',
      'date': 'sophisticated and romantic',
      'party': 'bold and statement-making'
    };
    
    const mood = answers.mood || 'relaxed';
    const weather = answers.weather || 'sunny';
    const occasion = answers.occasion || 'casual';
    
    return {
      title: `${moodOutfits[mood]} ${occasionOutfits[occasion]} look`,
      description: `A ${moodOutfits[mood]} outfit that's perfect for ${weather} weather and a ${occasion} occasion. Mix textures and add subtle accessories for dimension.`,
      image: `/lovable-uploads/c26c0c8c-7ff3-432a-b79b-1d22494daba6.png`,
      items: [
        'Fitted blazer in neutral tone',
        'High-waisted trousers or jeans',
        'Statement top in a complementary color',
        'Versatile ankle boots or loafers',
        'Minimalist jewelry for a polished finish'
      ]
    };
  };
  
  const isCompleted = currentStep >= questions.length;
  
  return (
    <div className="relative w-full my-12">
      {!showQuiz ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden shadow-lg border border-purple-500/20 bg-gradient-to-br from-slate-900/80 to-purple-900/40 backdrop-blur-md p-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-pink-400 shadow-md">
              <AvatarImage src="/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png" alt="Olivia Bloom" />
              <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                Style Discovery Quiz
              </h3>
              <p className="text-sm md:text-base text-blue-100 mb-4">
                Answer a few fun questions and I'll suggest the perfect outfit for your day!
              </p>
              
              <Button 
                onClick={toggleQuiz}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-pink-500/20"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Take the Quiz
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="rounded-xl overflow-hidden shadow-lg border border-purple-500/20 bg-gradient-to-br from-slate-900/80 to-purple-900/40 backdrop-blur-md"
        >
          <div className="flex justify-between items-center p-4 border-b border-purple-500/20">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-pink-400/50">
                <AvatarImage src="/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png" alt="Olivia Bloom" />
                <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-medium text-white">Style Discovery with Olivia</h3>
                <div className="flex items-center gap-1">
                  {questions.map((_, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "h-1.5 rounded-full w-6 transition-colors",
                        index < currentStep ? "bg-pink-500" : "bg-white/20"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleQuiz}
              className="text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-6">
            <AnimatePresence mode="wait">
              {!isCompleted ? (
                <QuizQuestion 
                  key={currentStep}
                  question={questions[currentStep]}
                  onAnswer={(answer) => handleAnswer(questions[currentStep].id, answer)}
                />
              ) : (
                <OutfitSuggestion 
                  key="result"
                  suggestion={getOutfitSuggestion()}
                  onReset={handleReset}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StyleDiscoveryQuiz;
