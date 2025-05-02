
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Coffee, 
  Wine, 
  Dumbbell, 
  PartyPopper, 
  Plane, 
  Heart, 
  Home, 
  Palette,
  Sparkles
} from 'lucide-react';

interface StyleQuizProps {
  onComplete: (answers: Record<string, string>) => void;
  activityIcons?: Record<string, React.ReactNode>;
  gradientButtonStyle?: boolean;
}

const StyleQuiz = ({ onComplete, activityIcons, gradientButtonStyle = false }: StyleQuizProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({
    activity: 'casual'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);

  const handleChange = (value: string) => {
    setAnswers({
      ...answers,
      activity: value
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    
    // Start typing effect
    const activityName = getActivityDisplayName(answers.activity);
    const fullText = `Got it! You're planning for a ${activityName} day — Olivia is crafting your perfect outfit...`;
    
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setTypingText(fullText.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTypingComplete(true);
      }
    }, 30);
    
    // Complete the quiz after a brief delay
    setTimeout(() => {
      onComplete(answers);
    }, 1000);
  };
  
  const getActivityDisplayName = (activity: string): string => {
    const displayNames: Record<string, string> = {
      casual: 'casual',
      work: 'work',
      formal: 'formal',
      sport: 'sport/active',
      party: 'party',
      travel: 'travel',
      date: 'date',
      lounge: 'lounge',
      creative: 'creative'
    };
    
    return displayNames[activity] || activity;
  };

  // Define default activity icons
  const defaultActivityIcons = {
    casual: <Coffee className="h-4 w-4 mr-1" />,
    work: <Briefcase className="h-4 w-4 mr-1" />,
    formal: <Wine className="h-4 w-4 mr-1" />,
    sport: <Dumbbell className="h-4 w-4 mr-1" />,
    party: <PartyPopper className="h-4 w-4 mr-1" />,
    travel: <Plane className="h-4 w-4 mr-1" />,
    date: <Heart className="h-4 w-4 mr-1" />,
    lounge: <Home className="h-4 w-4 mr-1" />,
    creative: <Palette className="h-4 w-4 mr-1" />
  };

  const icons = activityIcons || defaultActivityIcons;

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 space-y-4"
      >
        <div className="flex items-center justify-center mb-3">
          <motion.div 
            className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center relative"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {/* Olivia's avatar */}
            <Sparkles className="h-6 w-6 text-white" />
            
            {/* Sparkle effects */}
            <motion.div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full opacity-80"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.2,
                repeatDelay: 1
              }}
            />
            <motion.div 
              className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-300 rounded-full opacity-80"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.7,
                repeatDelay: 1
              }}
            />
          </motion.div>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-5 shadow-inner">
          <p className="text-white/90 text-center">
            {typingText}
            {!typingComplete && (
              <span className="inline-block ml-1 animate-pulse">|</span>
            )}
          </p>
          
          {typingComplete && (
            <motion.div 
              className="mt-4 pt-4 border-t border-white/10 text-center text-white/70"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <span className="text-purple-300">✨</span> Analyzing your style preferences and today's weather
              <span className="inline-flex ml-1">
                <motion.span 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
                >.</motion.span>
                <motion.span 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.4 }}
                >.</motion.span>
                <motion.span 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.6 }}
                >.</motion.span>
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-700/30 rounded-lg p-3 shadow-inner"
      >
        <p className="text-sm text-white/80 mb-3">
          What's your activity for today?
        </p>
        
        <RadioGroup 
          value={answers.activity}
          onValueChange={handleChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
            <RadioGroupItem value="casual" id="casual" className="text-purple-400" />
            <Label htmlFor="casual" className="flex items-center text-white/80 text-sm cursor-pointer">
              {icons.casual}
              Casual
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
            <RadioGroupItem value="work" id="work" className="text-purple-400" />
            <Label htmlFor="work" className="flex items-center text-white/80 text-sm cursor-pointer">
              {icons.work}
              Work
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
            <RadioGroupItem value="formal" id="formal" className="text-purple-400" />
            <Label htmlFor="formal" className="flex items-center text-white/80 text-sm cursor-pointer">
              {icons.formal}
              Formal
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
            <RadioGroupItem value="sport" id="sport" className="text-purple-400" />
            <Label htmlFor="sport" className="flex items-center text-white/80 text-sm cursor-pointer">
              {icons.sport}
              Sport/Active
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
            <RadioGroupItem value="party" id="party" className="text-purple-400" />
            <Label htmlFor="party" className="flex items-center text-white/80 text-sm cursor-pointer">
              {icons.party}
              Party
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
            <RadioGroupItem value="travel" id="travel" className="text-purple-400" />
            <Label htmlFor="travel" className="flex items-center text-white/80 text-sm cursor-pointer">
              {icons.travel}
              Travel
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
            <RadioGroupItem value="date" id="date" className="text-purple-400" />
            <Label htmlFor="date" className="flex items-center text-white/80 text-sm cursor-pointer">
              {icons.date}
              Date
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
            <RadioGroupItem value="lounge" id="lounge" className="text-purple-400" />
            <Label htmlFor="lounge" className="flex items-center text-white/80 text-sm cursor-pointer">
              {icons.lounge}
              Lounge
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
            <RadioGroupItem value="creative" id="creative" className="text-purple-400" />
            <Label htmlFor="creative" className="flex items-center text-white/80 text-sm cursor-pointer">
              {icons.creative}
              Creative
            </Label>
          </div>
        </RadioGroup>
      </motion.div>
      
      <Button 
        onClick={handleSubmit}
        className={cn(
          "w-full",
          gradientButtonStyle 
            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md text-white border-none"
            : "bg-purple-500 hover:bg-purple-600 text-white"
        )}
      >
        Update My Activity
      </Button>
    </div>
  );
};

export default StyleQuiz;
