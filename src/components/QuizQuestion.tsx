
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface QuizOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface QuizQuestionProps {
  question: {
    id: string;
    question: string;
    options: QuizOption[];
  };
  onAnswer: (value: string) => void;
}

const QuizQuestion = ({ question, onAnswer }: QuizQuestionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-semibold text-white mb-6">{question.question}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {question.options.map((option) => {
          const Icon = option.icon;
          
          return (
            <Button
              key={option.value}
              onClick={() => onAnswer(option.value)}
              className={cn(
                "flex flex-col items-center text-center h-auto py-6 gap-3",
                "bg-white/5 hover:bg-white/10 border border-white/10",
                "transition-all duration-200"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                <Icon className="h-5 w-5 text-pink-300" />
              </div>
              <span>{option.label}</span>
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuizQuestion;
