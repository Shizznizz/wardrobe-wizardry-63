import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Palette, 
  Shirt, 
  User, 
  Calendar, 
  CloudSun, 
  Check, 
  ArrowRight, 
  HelpCircle,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Confetti } from '@/components/ui/confetti';
import { useAuth } from '@/hooks/useAuth';
import { saveUserPreferences } from '@/integrations/supabase/client';
import { ClothingColor, UserPreferences } from '@/lib/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Define the quiz questions structure
const quizQuestions = [
  {
    id: 'colors',
    question: 'What colors do you wear most frequently?',
    options: [
      { value: 'black', label: 'Black', icon: Palette },
      { value: 'white', label: 'White', icon: Palette },
      { value: 'blue', label: 'Blue', icon: Palette },
      { value: 'red', label: 'Red', icon: Palette },
      { value: 'green', label: 'Green', icon: Palette },
      { value: 'yellow', label: 'Yellow', icon: Palette },
      { value: 'purple', label: 'Purple', icon: Palette },
      { value: 'pink', label: 'Pink', icon: Palette },
      { value: 'gray', label: 'Gray', icon: Palette },
      { value: 'navy', label: 'Navy', icon: Palette },
      { value: 'brown', label: 'Brown', icon: Palette },
      { value: 'beige', label: 'Beige', icon: Palette },
    ],
    multiSelect: true,
  },
  {
    id: 'styles',
    question: 'What clothing styles do you prefer?',
    options: [
      { value: 'casual', label: 'Casual', icon: Shirt },
      { value: 'business casual', label: 'Business Casual', icon: Shirt },
      { value: 'sportswear', label: 'Sportswear', icon: Shirt },
      { value: 'boho', label: 'Boho', icon: Shirt },
      { value: 'elegant', label: 'Elegant', icon: Shirt },
      { value: 'minimalist', label: 'Minimalist', icon: Shirt },
      { value: 'trendy', label: 'Trendy', icon: Shirt },
      { value: 'streetwear', label: 'Streetwear', icon: Shirt },
      { value: 'romantic', label: 'Romantic', icon: Shirt },
    ],
    multiSelect: true,
    maxSelect: 3,
  },
  {
    id: 'patterns',
    question: 'Do you prefer bold or neutral patterns?',
    options: [
      { value: 'bold', label: 'Bold patterns', icon: Palette },
      { value: 'subtle', label: 'Subtle patterns', icon: Palette },
      { value: 'neutral', label: 'No patterns', icon: Palette },
      { value: 'mix', label: 'Mix of both', icon: Palette },
    ],
    multiSelect: false,
  },
  {
    id: 'bodyType',
    question: 'Which body shape best describes you?',
    options: [
      { value: 'hourglass', label: 'Hourglass', icon: User },
      { value: 'apple', label: 'Apple', icon: User },
      { value: 'pear', label: 'Pear', icon: User },
      { value: 'rectangle', label: 'Rectangle', icon: User },
      { value: 'inverted-triangle', label: 'Inverted Triangle', icon: User },
      { value: 'not-specified', label: 'I prefer not to specify', icon: User },
    ],
    multiSelect: false,
  },
  {
    id: 'occasions',
    question: 'What kind of outfits do you need most often?',
    options: [
      { value: 'everyday', label: 'Everyday Outfits', icon: Calendar },
      { value: 'work', label: 'Work Outfits', icon: Calendar },
      { value: 'party', label: 'Party Outfits', icon: Calendar },
      { value: 'vacation', label: 'Vacation Outfits', icon: Calendar },
      { value: 'special', label: 'Special Occasions', icon: Calendar },
    ],
    multiSelect: true,
  },
  {
    id: 'climate',
    question: 'What climate conditions do you dress for most often?',
    options: [
      { value: 'hot', label: 'Hot Days', icon: CloudSun },
      { value: 'cold', label: 'Cold Days', icon: CloudSun },
      { value: 'rainy', label: 'Rainy Days', icon: CloudSun },
      { value: 'windy', label: 'Windy Days', icon: CloudSun },
      { value: 'flexible', label: 'Varied Climate', icon: CloudSun },
    ],
    multiSelect: true,
  },
];

interface PersonalizedStyleQuizProps {
  onComplete?: (preferences: UserPreferences) => void;
  onClose?: () => void;
  standalone?: boolean;
}

const PersonalizedStyleQuiz = ({ onComplete, onClose, standalone = false }: PersonalizedStyleQuizProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  
  const handleMultiSelect = (questionId: string, value: string) => {
    setAnswers(prev => {
      const currentValues = prev[questionId] || [];
      const question = quizQuestions.find(q => q.id === questionId);
      
      // If not multiSelect, replace the value
      if (!question?.multiSelect) {
        return { ...prev, [questionId]: value };
      }
      
      // Check if already selected (toggle)
      if (currentValues.includes(value)) {
        return { ...prev, [questionId]: currentValues.filter((v: string) => v !== value) };
      }
      
      // Check max select limit
      if (question.maxSelect && currentValues.length >= question.maxSelect) {
        toast.info(`You can only select up to ${question.maxSelect} options`);
        return prev;
      }
      
      // Add to selected values
      return { ...prev, [questionId]: [...currentValues, value] };
    });
  };
  
  const isOptionSelected = (questionId: string, value: string) => {
    const currentValues = answers[questionId] || [];
    return Array.isArray(currentValues) 
      ? currentValues.includes(value) 
      : currentValues === value;
  };
  
  const goToNextQuestion = () => {
    // Validate if current question needs an answer
    const currentQuestion = quizQuestions[currentStep];
    const currentAnswer = answers[currentQuestion.id];
    
    if (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
      toast.error("Please select at least one option");
      return;
    }
    
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz complete
      completeQuiz();
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const completeQuiz = async () => {
    setShowConfetti(true);
    
    // Convert quiz answers to UserPreferences format
    const preferences: UserPreferences = {
      favoriteColors: (answers.colors || ['black', 'blue']) as ClothingColor[],
      favoriteStyles: answers.styles || ['casual', 'minimalist'],
      bodyType: answers.bodyType || 'not-specified',
      occasionPreferences: answers.occasions || ['everyday', 'work'],
      climatePreferences: answers.climate || ['flexible'],
      
      // Add patterns field to the UserPreferences type in a way that complies with the type definition
      // We'll store this in personalityTags to avoid type errors
      personalityTags: answers.patterns ? [answers.patterns] : ['neutral'],
      
      // Keep existing seasonal preferences or use defaults
      seasonalPreferences: {
        spring: { 
          enabled: true, 
          temperatureRange: [10, 22] 
        },
        summer: { 
          enabled: true, 
          temperatureRange: [20, 35] 
        },
        autumn: { 
          enabled: true, 
          temperatureRange: [8, 20] 
        },
        winter: { 
          enabled: true, 
          temperatureRange: [-5, 10] 
        },
        all: { 
          enabled: true, 
          temperatureRange: [-10, 40] 
        }
      },
      outfitReminders: false,
      reminderTime: '08:00',
    };
    
    // Save preferences if user is logged in
    if (user) {
      try {
        const { success, error } = await saveUserPreferences(user.id, preferences);
        
        if (success) {
          toast.success("Your style profile has been saved!");
        } else {
          console.error("Error saving preferences:", error);
          toast.error("Failed to save your preferences");
        }
      } catch (err) {
        console.error("Error saving preferences:", err);
        toast.error("An error occurred while saving your preferences");
      }
    }
    
    // Set as complete and call the onComplete callback
    setQuizComplete(true);
    if (onComplete) {
      onComplete(preferences);
    }
  };
  
  const handleRestartQuiz = () => {
    setCurrentStep(0);
    setQuizComplete(false);
    setShowConfetti(false);
    setAnswers({});
  };
  
  const handleClose = () => {
    if (onClose) onClose();
    else if (standalone) navigate('/');
  };
  
  const handleContinueToApp = () => {
    navigate('/my-wardrobe');
  };

  return (
    <div className="min-h-full w-full max-w-3xl mx-auto">
      {showConfetti && <Confetti duration={3000} />}
      
      <Card className="bg-gradient-to-br from-slate-900/90 to-purple-900/60 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl overflow-hidden">
        {/* Quiz Header */}
        <div className="px-6 py-5 md:px-8 md:py-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Personalized Style Quiz
            </h2>
            <p className="text-blue-200/80 text-sm mt-1">
              Help us understand your unique style preferences
            </p>
          </div>
          
          {/* Close button if not standalone */}
          {!standalone && (
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-white/70 hover:text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Progress indicator */}
          {!quizComplete && (
            <div className="mb-6">
              <div className="flex space-x-1 mb-1">
                {quizQuestions.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      idx === currentStep 
                        ? 'bg-purple-500' 
                        : idx < currentStep 
                          ? 'bg-blue-600' 
                          : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <p className="text-white/60 text-sm">
                Question {currentStep + 1} of {quizQuestions.length}
              </p>
            </div>
          )}
          
          <AnimatePresence mode="wait">
            {!quizComplete ? (
              <motion.div
                key={`question-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Current Question */}
                <h3 className="text-xl font-semibold text-white">
                  {quizQuestions[currentStep].question}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {quizQuestions[currentStep].options.map((option) => {
                    const selected = isOptionSelected(quizQuestions[currentStep].id, option.value);
                    
                    return (
                      <Button
                        key={option.value}
                        onClick={() => handleMultiSelect(quizQuestions[currentStep].id, option.value)}
                        className={`flex flex-col h-auto py-4 px-2 text-sm items-center justify-center gap-2 transition-all ${
                          selected
                            ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white border-purple-400'
                            : 'bg-white/5 hover:bg-white/10 text-white/90 border-white/10'
                        }`}
                        variant="outline"
                      >
                        <div className={`w-8 h-8 rounded-full ${
                          selected ? 'bg-white/20' : 'bg-white/10'
                        } flex items-center justify-center`}>
                          {selected ? (
                            <Check className="h-4 w-4 text-white" />
                          ) : (
                            <option.icon className="h-4 w-4 text-white/80" />
                          )}
                        </div>
                        <span>{option.label}</span>
                      </Button>
                    );
                  })}
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    variant="ghost"
                    onClick={goToPreviousQuestion}
                    disabled={currentStep === 0}
                    className="text-white/70 hover:text-white"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={goToNextQuestion}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    {currentStep < quizQuestions.length - 1 ? 'Next' : 'Complete'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="completion"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white">Your style profile is complete!</h3>
                  
                  <p className="text-white/80 leading-relaxed">
                    Your preferences have been saved. Olivia will now suggest outfits based on your:
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-2 py-2">
                    {answers.colors && Array.isArray(answers.colors) && (
                      <Badge className="bg-purple-500/30 text-purple-200 border-purple-500/50">
                        {answers.colors.length} selected colors
                      </Badge>
                    )}
                    
                    {answers.styles && Array.isArray(answers.styles) && (
                      <Badge className="bg-blue-500/30 text-blue-200 border-blue-500/50">
                        {answers.styles.join(', ')} style
                      </Badge>
                    )}
                    
                    {answers.bodyType && (
                      <Badge className="bg-pink-500/30 text-pink-200 border-pink-500/50">
                        {answers.bodyType} body type
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Olivia Introduction */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex gap-4 mt-6">
                  <Avatar className="h-12 w-12 border-2 border-purple-400/50">
                    <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                    <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-1">Olivia Bloom</h4>
                    <p className="text-white/80 text-sm">
                      Thanks for sharing your style preferences! I'll use this information to create personalized outfit recommendations tailored just for you.
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleRestartQuiz}
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    Retake Quiz
                  </Button>
                  
                  <Button
                    onClick={handleContinueToApp}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white sm:ml-auto"
                  >
                    Explore Your Style
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedStyleQuiz;
