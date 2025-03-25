
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SendHorizontal, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

const outfitSuggestions = [
  "Try your beige trench coat with black ankle boots and a white blouse — perfect balance of cozy and chic.",
  "A lightweight cardigan over a floral dress with white sneakers would be ideal for this situation.",
  "Layer a denim jacket over a striped tee with dark jeans and boots for a casual but put-together look.",
  "A midi skirt with a tucked-in sweater and knee-high boots would be both comfortable and stylish.",
  "Pair your favorite jeans with a cozy oversized sweater and ankle boots for the perfect blend of comfort and style.",
  "A blazer over a simple t-shirt with straight-leg trousers and loafers creates an effortlessly polished look.",
  "Try a sweater dress with tights and ankle boots, topped with your camel coat for warmth and elegance.",
  "Layer a turtleneck under a slip dress with chunky boots for an on-trend transitional outfit."
];

const getRandomSuggestion = () => {
  const randomIndex = Math.floor(Math.random() * outfitSuggestions.length);
  return outfitSuggestions[randomIndex];
};

const StyleSituation = () => {
  const [situation, setSituation] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;
    
    // Reset previous suggestion
    setSuggestion('');
    setTypedText('');
    
    // Get a new suggestion
    const newSuggestion = getRandomSuggestion();
    setSuggestion(newSuggestion);
    
    // Start typing effect
    setIsTyping(true);
    typeText(newSuggestion);
  };
  
  const typeText = (text: string) => {
    let i = 0;
    setTypedText('');
    
    const typing = setInterval(() => {
      if (i < text.length) {
        setTypedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typing);
        setIsTyping(false);
      }
    }, 30);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-${isMobile ? '4' : '6'} shadow-xl`}
    >
      <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center gap-2`}>
        <Sparkles className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-pink-400`} />
        Style Situation
      </h3>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <Input
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder={isMobile ? "Describe event (e.g., 'Date, 15°C')" : "Describe your event (e.g., 'Date in 15°C')"}
          className="flex-grow bg-slate-800/60 border-purple-500/30 text-white placeholder:text-slate-400"
        />
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          disabled={isTyping || !situation.trim()}
        >
          <SendHorizontal className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
        </Button>
      </form>
      
      {(suggestion || isTyping) && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/40 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20"
        >
          <div className="flex gap-3">
            <Avatar className={`${isMobile ? 'h-7 w-7' : 'h-8 w-8'} border border-pink-500/50`}>
              <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500">OB</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-purple-300 mb-1`}>Olivia's suggestion:</div>
              <p className={`text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {typedText}
                {isTyping && (
                  <span className="inline-block w-2 h-4 bg-purple-400 ml-1 animate-pulse"></span>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StyleSituation;
