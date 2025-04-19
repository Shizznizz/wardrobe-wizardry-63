
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const QuizIntroMessage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 mb-8 border border-white/10"
    >
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        
        <div className="space-y-3">
          <p className="text-lg text-white/90">
            This quiz helps Olivia understand your style preferences and body type to provide better outfit suggestions.
          </p>
          <p className="text-sm text-white/80">
            Answer a few questions to help Olivia create personalized outfit recommendations tailored just for you!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizIntroMessage;
