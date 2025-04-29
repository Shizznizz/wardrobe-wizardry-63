
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Confetti } from '@/components/ui/confetti';
import { 
  Sparkles, 
  Coffee, 
  Umbrella, 
  Sunset, 
  Moon, 
  Party, 
  Check, 
  ArrowRight, 
  X,
  Heart,
  Star,
  Music
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Define the quiz questions structure with fun, mood-based questions
const moodQuestions = [
  {
    id: 'mood',
    question: "What's your vibe today?",
    emoji: "✨",
    options: [
      { value: 'energetic', label: 'Ready to take on the world!', icon: Sparkles, color: 'from-pink-500 to-purple-500' },
      { value: 'relaxed', label: "Chillin' like a boss", icon: Coffee, color: 'from-blue-500 to-cyan-400' },
      { value: 'cozy', label: "Let's keep it cozy", icon: Sunset, color: 'from-amber-500 to-red-400' },
      { value: 'glamorous', label: "In the mood to shine", icon: Star, color: 'from-yellow-400 to-orange-500' },
    ],
  },
  {
    id: 'weather',
    question: "The weather outside is...",
    emoji: "☂️",
    options: [
      { value: 'sunny', label: 'Gorgeously sunny', icon: Sunset, color: 'from-yellow-400 to-orange-500' },
      { value: 'rainy', label: 'Rain, rain, come my way', icon: Umbrella, color: 'from-blue-500 to-indigo-500' },
      { value: 'cloudy', label: 'Cloud party above', icon: Moon, color: 'from-gray-400 to-gray-600' },
      { value: 'perfect', label: 'Just perfect!', icon: Star, color: 'from-green-400 to-cyan-400' },
    ],
  },
  {
    id: 'plans',
    question: "What's on your agenda?",
    emoji: "📅",
    options: [
      { value: 'social', label: 'Meeting up with my crew', icon: Party, color: 'from-purple-400 to-pink-500' },
      { value: 'work', label: 'Crushing my to-do list', icon: Coffee, color: 'from-blue-400 to-indigo-600' },
      { value: 'relax', label: 'Me, myself, and chill', icon: Moon, color: 'from-indigo-400 to-purple-500' },
      { value: 'adventure', label: 'Going on an adventure!', icon: Sparkles, color: 'from-green-500 to-emerald-400' },
    ],
  },
  {
    id: 'confidence',
    question: "Today, I'm feeling...",
    emoji: "💫",
    options: [
      { value: 'superstar', label: 'Like a total superstar', icon: Star, color: 'from-amber-400 to-orange-500' },
      { value: 'cute', label: 'Cute and playful', icon: Heart, color: 'from-pink-400 to-rose-500' },
      { value: 'bold', label: 'Bold and fearless', icon: Sparkles, color: 'from-purple-500 to-indigo-500' },
      { value: 'subtle', label: 'Subtly fabulous', icon: Music, color: 'from-blue-400 to-cyan-500' },
    ],
  },
  {
    id: 'color',
    question: "If your mood was a color today?",
    emoji: "🎨",
    options: [
      { value: 'red', label: 'Passionate red', icon: Heart, color: 'from-red-500 to-rose-500' },
      { value: 'blue', label: 'Cool blue', icon: Coffee, color: 'from-blue-500 to-cyan-400' },
      { value: 'yellow', label: 'Sunny yellow', icon: Sunset, color: 'from-yellow-400 to-amber-500' },
      { value: 'purple', label: 'Mysterious purple', icon: Sparkles, color: 'from-purple-500 to-indigo-500' },
    ],
  },
];

// Fun outfits based on mood combinations
const getMoodOutfit = (answers: Record<string, string>) => {
  // Map of mood combinations to outfit suggestions
  const outfitMap: Record<string, any> = {
    // Energetic combinations
    "energetic_sunny_social": {
      title: "Vibrant Social Butterfly",
      description: "A bright, eye-catching outfit perfect for making an entrance and lighting up any social gathering.",
      items: ["Bold printed dress or colorful top", "Statement accessories", "Fun, comfortable shoes for dancing", "Lightweight jacket for later"],
      image: "/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png"
    },
    "energetic_rainy_work": {
      title: "Power Through the Rain",
      description: "Weather-appropriate but still high-energy outfit that keeps you looking professional while staying dry.",
      items: ["Bright colored blouse or shirt", "Tailored pants or skirt", "Water-resistant jacket or coat", "Stylish rain boots or water-resistant shoes"],
      image: "/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png"
    },
    
    // Relaxed combinations
    "relaxed_sunny_relax": {
      title: "Sunshine Lounging",
      description: "Effortlessly cool outfit for a relaxed day soaking up the sun's good vibes.",
      items: ["Loose linen shirt or flowy top", "Comfortable shorts or wide-leg pants", "Sandals or slip-on shoes", "Sun hat or cool sunglasses"],
      image: "/lovable-uploads/c26c0c8c-7ff3-432a-b79b-1d22494daba6.png"
    },
    "relaxed_cloudy_adventure": {
      title: "Casual Explorer",
      description: "Layer-friendly outfit that's ready for whatever the day might bring, keeping comfort as the priority.",
      items: ["Comfortable jeans or utility pants", "Layerable tops", "Light jacket or sweater", "Comfortable walking shoes"],
      image: "/lovable-uploads/c26c0c8c-7ff3-432a-b79b-1d22494daba6.png"
    },
    
    // Default outfit if no specific match
    "default": {
      title: "Mood-Matching Perfect Outfit",
      description: "An outfit that perfectly balances your current mood, the weather, and your plans for today.",
      items: ["Pieces that make you feel confident", "Weather-appropriate layers", "Accessories that express your personality", "Comfortable footwear for your activities"],
      image: "/lovable-uploads/c26c0c8c-7ff3-432a-b79b-1d22494daba6.png"
    }
  };
  
  // Create a key from the answers to look up in the map
  const key = `${answers.mood || ''}_${answers.weather || ''}_${answers.plans || ''}`;
  
  // Return matching outfit or default
  return outfitMap[key] || outfitMap.default;
};

interface OliviaMoodMatcherProps {
  onClose?: () => void;
  onOutfitGenerated?: (outfit: any) => void;
}

const OliviaMoodMatcher = ({ onClose, onOutfitGenerated }: OliviaMoodMatcherProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [outfit, setOutfit] = useState<any>(null);
  
  const handleSelection = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
    
    // Auto-advance to next question
    if (currentStep < moodQuestions.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    } else {
      // Complete the quiz
      completeQuiz();
    }
  };
  
  const goBackQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const completeQuiz = () => {
    setShowConfetti(true);
    
    // Generate outfit recommendation based on mood
    const generatedOutfit = getMoodOutfit(answers);
    setOutfit(generatedOutfit);
    
    if (onOutfitGenerated) {
      onOutfitGenerated(generatedOutfit);
    }
    
    setIsComplete(true);
    toast.success("Your mood-matching outfit is ready!", {
      icon: "✨"
    });
  };
  
  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsComplete(false);
    setShowConfetti(false);
    setOutfit(null);
  };

  return (
    <div className="min-h-full w-full max-w-3xl mx-auto">
      {showConfetti && <Confetti duration={4000} />}
      
      <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-800/60 backdrop-blur-lg border border-pink-400/20 rounded-xl shadow-xl overflow-hidden">
        {/* Quiz Header */}
        <div className="px-6 py-5 md:px-8 md:py-6 bg-gradient-to-r from-purple-700/50 to-pink-600/50 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-200">
              Olivia's Mood Matcher
            </h2>
            <p className="text-pink-100/90 text-sm mt-1">
              Let's find your perfect outfit vibe today!
            </p>
          </div>
          
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/10">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <CardContent className="p-6 md:p-8 space-y-6">
          {!isComplete ? (
            <>
              {/* Progress Dots */}
              <div className="flex justify-center space-x-2 mb-8">
                {moodQuestions.map((_, idx) => (
                  <motion.div 
                    key={idx}
                    className={cn(
                      "w-3 h-3 rounded-full",
                      idx === currentStep 
                        ? "bg-gradient-to-r from-pink-500 to-purple-500" 
                        : idx < currentStep 
                          ? "bg-pink-400/70" 
                          : "bg-white/20"
                    )}
                    initial={{ scale: idx === currentStep ? 0.8 : 1 }}
                    animate={{ 
                      scale: idx === currentStep ? 1.2 : 1,
                      opacity: idx === currentStep ? 1 : idx < currentStep ? 0.8 : 0.5
                    }}
                    transition={{ duration: 0.4 }}
                  />
                ))}
              </div>
              
              {/* Olivia's Message */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex gap-4 mb-6 border border-white/20">
                <Avatar className="h-12 w-12 border-2 border-pink-400/50">
                  <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                  <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
                </Avatar>
                
                <div>
                  <h4 className="font-semibold text-white mb-1">Olivia Bloom</h4>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {currentStep === 0 ? 
                      "Hey there! Let's have some fun and find an outfit that matches your mood today! Ready?" :
                      "Great choice! Let's keep going to find your perfect mood-matching outfit!"}
                  </p>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`question-${currentStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Current Question */}
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">{moodQuestions[currentStep].emoji}</div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {moodQuestions[currentStep].question}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {moodQuestions[currentStep].options.map((option) => {
                      const isSelected = answers[moodQuestions[currentStep].id] === option.value;
                      
                      return (
                        <Button
                          key={option.value}
                          onClick={() => handleSelection(moodQuestions[currentStep].id, option.value)}
                          className={cn(
                            "h-auto py-4 px-4 transition-all duration-200 overflow-hidden group relative",
                            isSelected 
                              ? `bg-gradient-to-r ${option.color} border-white/20`
                              : "bg-white/10 hover:bg-white/20 border-white/10"
                          )}
                          variant="outline"
                        >
                          <motion.div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: isSelected ? 0.15 : 0 }}
                            transition={{ duration: 0.2 }}
                          />
                          
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              isSelected ? "bg-white/30" : "bg-white/10"
                            )}>
                              <option.icon className={cn(
                                "h-5 w-5",
                                isSelected ? "text-white" : "text-white/70"
                              )} />
                            </div>
                            
                            <div className="flex-1 text-left">
                              <p className={cn(
                                "font-medium text-base transition-all",
                                isSelected ? "text-white" : "text-white/90"
                              )}>
                                {option.label}
                              </p>
                            </div>
                          </div>
                          
                          <motion.div 
                            className={cn(
                              "absolute right-3 w-6 h-6 rounded-full bg-white flex items-center justify-center",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                            initial={{ scale: 0 }}
                            animate={{ scale: isSelected ? 1 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Check className="h-4 w-4 text-purple-600" />
                          </motion.div>
                        </Button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation Row */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="ghost"
                  onClick={goBackQuestion}
                  disabled={currentStep === 0}
                  className="text-white/70 hover:text-white"
                >
                  Back
                </Button>
                
                <div className="text-white/60 text-sm font-medium">
                  {currentStep + 1} of {moodQuestions.length}
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Your Vibe Today</h3>
                
                <div className="flex justify-center flex-wrap gap-2 mb-6">
                  {Object.entries(answers).map(([key, value]) => {
                    const question = moodQuestions.find(q => q.id === key);
                    const option = question?.options.find(o => o.value === value);
                    
                    if (!option) return null;
                    
                    return (
                      <Badge 
                        key={key}
                        className={cn(
                          "px-3 py-1 text-sm bg-gradient-to-r border-white/10",
                          option.color
                        )}
                      >
                        {option.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              
              {outfit && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-pink-400/20">
                  <div className="p-5 bg-gradient-to-r from-purple-800/40 to-pink-600/40 border-b border-white/10">
                    <h4 className="font-bold text-xl text-white">{outfit.title}</h4>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <div className="rounded-lg overflow-hidden border border-white/10">
                          <img 
                            src={outfit.image} 
                            alt="Outfit suggestion" 
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      </div>
                      
                      <div className="md:w-2/3 space-y-4">
                        <p className="text-white/80">{outfit.description}</p>
                        
                        <div className="space-y-2">
                          <h5 className="font-medium text-white">Perfect Items:</h5>
                          <ul className="space-y-1">
                            {outfit.items.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-xs text-white">
                                  {idx + 1}
                                </div>
                                <span className="text-white/90">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-pink-500/10 rounded-lg p-4 border border-pink-500/20 flex gap-4 mt-4">
                          <Avatar className="h-10 w-10 border border-pink-400/50">
                            <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                            <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <p className="text-white/90 text-sm">
                              <span className="font-semibold text-white">Olivia's Tip:</span>{" "}
                              This outfit is perfectly matched to your current mood and activities. Don't be afraid to add your own twist with accessories that make you feel confident!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleRestart}
                  className="border-white/10 text-white hover:bg-white/10"
                >
                  Try Again
                </Button>
                
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white sm:ml-auto"
                >
                  Save & Close
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OliviaMoodMatcher;
