
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const QuizIntroMessage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-dark p-4 rounded-lg border border-purple-500/20 mb-6 flex items-center gap-3"
    >
      <Avatar className="h-10 w-10 border-2 border-purple-500/30">
        <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
        <AvatarFallback>OB</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-white/90 text-sm md:text-base">
          Let's find your perfect look for today! 
          <span className="inline-block ml-1">
            <Sparkles className="h-4 w-4 text-purple-400 inline" />
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default QuizIntroMessage;
