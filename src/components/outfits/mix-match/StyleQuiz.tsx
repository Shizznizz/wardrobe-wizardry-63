
import React, { useState, useEffect } from 'react';
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
  Sparkles,
  ArrowDown,
  Star
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
  const [funFact, setFunFact] = useState('');
  const [stylingTip, setStylingTip] = useState('');
  const [quote, setQuote] = useState('');

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
    const fullText = `Great choice! Olivia has curated a stunning outfit for your ${activityName} day.`;
    
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
    
    // Set activity-specific content
    setActivitySpecificContent(answers.activity);
    
    // Complete the quiz after a brief delay
    setTimeout(() => {
      onComplete(answers);
    }, 1000);
  };
  
  const setActivitySpecificContent = (activity: string) => {
    switch(activity) {
      case 'casual':
        setFunFact("Did you know? The average person makes fashion decisions in less than 3 seconds!");
        setStylingTip("Try pairing neutral basics with one colorful statement piece for effortless style.");
        setQuote("\"Style is a way to say who you are without having to speak.\" — Rachel Zoe");
        break;
      case 'work':
        setFunFact("Fun fact: Power dressing became popular in the 1970s as women entered the corporate workforce.");
        setStylingTip("A well-fitted blazer can transform any basic outfit into a professional look.");
        setQuote("\"Dress for the job you want, not the job you have.\" — Austin Kleon");
        break;
      case 'formal':
        setFunFact("Did you know? The tuxedo was named after Tuxedo Park, NY, where it was first introduced to American society.");
        setStylingTip("When dressing formally, pay extra attention to the details - proper fit, pressed garments, and polished accessories.");
        setQuote("\"Being perfectly well-dressed gives one a tranquility that no religion can bestow.\" — Ralph Waldo Emerson");
        break;
      case 'sport':
        setFunFact("Fun fact: The first athletic shoes were created in the 1800s and were called 'plimsolls'.");
        setStylingTip("Layer performance fabrics for both style and temperature regulation during activities.");
        setQuote("\"Look good, feel good, play good.\" — Deion Sanders");
        break;
      case 'party':
        setFunFact("Did you know? Sequins were originally made from thin metal coins in ancient times.");
        setStylingTip("Statement accessories can transform a simple outfit into a party-ready look.");
        setQuote("\"People will stare. Make it worth their while.\" — Harry Winston");
        break;
      case 'travel':
        setFunFact("Fun fact: The concept of 'capsule wardrobes' was created in the 1970s to simplify packing and travel.");
        setStylingTip("Choose wrinkle-resistant fabrics and versatile pieces that can be mixed and matched.");
        setQuote("\"Travel light, travel far.\" — Anonymous");
        break;
      case 'date':
        setFunFact("Did you know? Red is scientifically proven to increase attractiveness perception in dating contexts.");
        setStylingTip("Wear something that makes you feel confident - it will naturally enhance your presence.");
        setQuote("\"Confidence is the best outfit. Rock it and own it.\" — Anonymous");
        break;
      case 'lounge':
        setFunFact("Fun fact: The term 'loungewear' first appeared in fashion vocabulary in the 1950s.");
        setStylingTip("Elevate your lounge look with coordinated sets rather than mismatched pieces.");
        setQuote("\"Comfort is key, but style should never be compromised.\" — Rachel Zoe");
        break;
      case 'creative':
        setFunFact("Did you know? Many creative professionals use dress as a form of self-expression and creative identity.");
        setStylingTip("Don't be afraid to mix patterns and textures to express your creative personality.");
        setQuote("\"Style is knowing who you are, what you want to say, and not giving a damn.\" — Gore Vidal");
        break;
      default:
        setFunFact("Did you know? The fashion industry is valued at over $1.7 trillion globally.");
        setStylingTip("Find your personal style by experimenting with different looks and noticing what makes you feel most confident.");
        setQuote("\"Fashion is what you buy, style is what you do with it.\" — Anonymous");
    }
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
              className="mt-6 pt-4 border-t border-white/10 text-center text-white/70 space-y-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {/* Fun Fact */}
              <motion.div 
                className="p-3 bg-purple-500/10 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-sm">
                  <Star className="inline-block h-4 w-4 text-yellow-400 mr-2" />
                  <span className="text-purple-200 font-medium">{funFact}</span>
                </p>
              </motion.div>
              
              {/* Styling Tip */}
              <motion.div 
                className="p-3 bg-blue-500/10 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-sm">
                  <span className="font-semibold text-blue-300">Olivia's Tip: </span>
                  <span className="text-white/80">{stylingTip}</span>
                </p>
              </motion.div>
              
              {/* Quote */}
              <motion.div 
                className="py-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <p className="text-sm italic text-white/70">{quote}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="flex justify-center pt-2"
              >
                <div className="flex flex-col items-center">
                  <p className="text-white/90 mb-2">Scroll down to see your complete look!</p>
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowDown className="h-5 w-5 text-purple-400" />
                  </motion.div>
                </div>
              </motion.div>
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
