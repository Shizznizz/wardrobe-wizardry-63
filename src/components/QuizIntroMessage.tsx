
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const QuizIntroMessage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 mb-6 border border-white/10"
    >
      <div className="flex items-start gap-3">
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        
        <p className="text-sm text-white/90">
          Answer a few questions to help Olivia understand your style preferences better. This will allow her to provide more personalized outfit recommendations tailored just for you!
        </p>
      </div>
    </motion.div>
  );
};

export default QuizIntroMessage;
