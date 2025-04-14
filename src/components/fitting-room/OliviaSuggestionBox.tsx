
import { motion } from 'framer-motion';
import { Sun, Cloud, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OliviaSuggestionBoxProps {
  weather?: string;
  suggestion: string;
}

const OliviaSuggestionBox = ({ weather, suggestion }: OliviaSuggestionBoxProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 rounded-xl border border-purple-500/20 p-4 mb-6"
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 border-2 border-purple-500/30">
          <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
          <AvatarFallback>OB</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-white">Olivia Suggests</h3>
            <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded-full">
              Style Advisor
            </span>
          </div>
          
          <p className="text-white/90 text-sm leading-relaxed">
            {suggestion}
          </p>
          
          {weather && (
            <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
              {weather.toLowerCase().includes('sun') ? (
                <Sun className="w-3 h-3" />
              ) : (
                <Cloud className="w-3 h-3" />
              )}
              <span>Based on today's weather</span>
            </div>
          )}
        </div>
        
        <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
      </div>
    </motion.div>
  );
};

export default OliviaSuggestionBox;
