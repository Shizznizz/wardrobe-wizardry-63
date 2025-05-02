
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Briefcase, Dumbbell, Sun, Wind, CloudRain } from 'lucide-react';

interface StyleQuizProps {
  onComplete: (answers: Record<string, string>) => void;
  activityIcons?: Record<string, React.ReactNode>;
  gradientButtonStyle?: boolean;
}

const StyleQuiz = ({ onComplete, activityIcons, gradientButtonStyle = false }: StyleQuizProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({
    activity: 'casual'
  });

  const handleChange = (value: string) => {
    setAnswers({
      ...answers,
      activity: value
    });
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  // Default icons if not provided
  const defaultActivityIcons = {
    work: <Briefcase className="h-4 w-4 mr-1" />,
    sport: <Dumbbell className="h-4 w-4 mr-1" />,
    casual: <Sun className="h-4 w-4 mr-1" />,
    formal: <Wind className="h-4 w-4 mr-1" />,
    party: <CloudRain className="h-4 w-4 mr-1" />
  };

  const icons = activityIcons || defaultActivityIcons;

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
        </RadioGroup>
      </motion.div>
      
      <Button 
        onClick={handleSubmit}
        className={cn(
          "w-full",
          gradientButtonStyle 
            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md text-white border-none"
            : "bg-orange-500 hover:bg-orange-600 text-white"
        )}
      >
        Update My Mood
      </Button>
    </div>
  );
};

export default StyleQuiz;
