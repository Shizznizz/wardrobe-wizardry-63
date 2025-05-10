
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface QuizQuestionOption {
  id: string;
  label: string;
  icon?: LucideIcon;
  imageUrl?: string;
}

export interface QuizQuestionProps {
  question: string;
  subtext?: string;
  options: QuizQuestionOption[];
  onAnswer: (optionId: string) => void;
  currentStep?: number;
  totalSteps?: number;
}

const QuizQuestion = ({
  question,
  subtext,
  options,
  onAnswer,
  currentStep,
  totalSteps,
}: QuizQuestionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto"
    >
      {currentStep !== undefined && totalSteps !== undefined && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i < currentStep ? "bg-pink-500 w-8" : "bg-white/20 w-6"
              )}
            />
          ))}
        </div>
      )}

      <h3 className="text-2xl font-semibold text-white mb-3">{question}</h3>
      
      {subtext && (
        <p className="text-white/70 mb-6">{subtext}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {options.map((option) => {
          const Icon = option.icon;
          
          return (
            <Button
              key={option.id}
              onClick={() => onAnswer(option.id)}
              variant="outline"
              className={cn(
                "relative h-auto py-6 px-4 gap-3 text-left justify-start",
                "group hover:bg-white/10 border border-white/10",
                "transition-all duration-200"
              )}
            >
              {option.imageUrl && (
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-500/30 to-pink-500/30 overflow-hidden">
                  <img 
                    src={option.imageUrl} 
                    alt={option.label}
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
              
              {Icon && !option.imageUrl && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-pink-300" />
                </div>
              )}
              
              <span className="font-medium text-base">{option.label}</span>
              
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-md transition-all duration-300 pointer-events-none" />
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuizQuestion;
