
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, ThumbsDown, Heart, CheckCircle, Save, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export interface FeedbackData {
  rating: number;
  fit: 'good' | 'bad' | null;
  favorite: boolean;
  outfitName: string;
}

interface FeedbackLoopProps {
  visible: boolean;
  outfitName: string;
  onClose: () => void;
  onFeedbackSubmit: (feedback: FeedbackData) => void;
  onSave?: () => void;
  onShopNow?: () => void;
  isPremium?: boolean;
  onUpgradeToPremium?: () => void;
}

const FeedbackLoop = ({
  visible,
  outfitName,
  onClose,
  onFeedbackSubmit,
  onSave,
  onShopNow,
  isPremium = false,
  onUpgradeToPremium
}: FeedbackLoopProps) => {
  const [rating, setRating] = useState<number>(0);
  const [fit, setFit] = useState<'good' | 'bad' | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  if (!visible) return null;
  
  const handleRatingSelect = (value: number) => {
    setRating(value);
  };
  
  const handleSave = () => {
    if (!isPremium && onUpgradeToPremium) {
      onUpgradeToPremium();
      return;
    }
    
    setFavorite(true);
    if (onSave) onSave();
    toast.success('Saved to your collection');
  };
  
  const handleSubmit = () => {
    const feedback: FeedbackData = {
      rating,
      fit,
      favorite,
      outfitName
    };
    
    onFeedbackSubmit(feedback);
    setSubmitted(true);
    
    // Reset and close after delay
    setTimeout(() => {
      setRating(0);
      setFit(null);
      setFavorite(false);
      setSubmitted(false);
      onClose();
    }, 1500);
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Card className="border border-purple-500/20 bg-gradient-to-r from-slate-900/80 to-purple-950/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4 sm:p-5">
              {submitted ? (
                <motion.div 
                  className="py-6 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-white">Thank you for your feedback!</h3>
                  <p className="text-white/70 text-sm mt-1">
                    Olivia's AI will learn from your preferences to improve future suggestions.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      How does this look?
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={onClose}
                      className="text-white/50 hover:text-white h-8 w-8 p-0"
                    >
                      &times;
                    </Button>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm text-white/70 mb-2">Rate how this looks on you</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <motion.button
                            key={value}
                            className="p-1 focus:outline-none focus:ring-1 focus:ring-purple-400 rounded-full"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRatingSelect(value)}
                          >
                            <Star 
                              className={`h-7 w-7 ${
                                value <= rating 
                                  ? "text-yellow-400 fill-yellow-400" 
                                  : "text-gray-500 hover:text-gray-400"
                              }`} 
                            />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-white/70 mb-2">How does it fit?</p>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline"
                          size="sm"
                          className={`border-white/10 ${
                            fit === 'good' 
                              ? 'bg-green-900/30 text-green-400 border-green-400/30' 
                              : 'text-white/70 hover:text-white'
                          }`}
                          onClick={() => setFit('good')}
                        >
                          <ThumbsUp className={`h-4 w-4 mr-2 ${fit === 'good' ? 'text-green-400' : ''}`} />
                          Perfect fit
                        </Button>
                        
                        <Button 
                          variant="outline"
                          size="sm"
                          className={`border-white/10 ${
                            fit === 'bad' 
                              ? 'bg-red-900/30 text-red-400 border-red-400/30' 
                              : 'text-white/70 hover:text-white'
                          }`}
                          onClick={() => setFit('bad')}
                        >
                          <ThumbsDown className={`h-4 w-4 mr-2 ${fit === 'bad' ? 'text-red-400' : ''}`} />
                          Needs adjustment
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                      <Button 
                        variant="outline"
                        size="sm"
                        className={`border-white/10 ${
                          favorite 
                            ? 'bg-pink-900/30 text-pink-400 border-pink-400/30' 
                            : 'text-white/70 hover:text-white'
                        }`}
                        onClick={handleSave}
                      >
                        <Heart 
                          className={`h-4 w-4 mr-2 ${favorite ? 'text-pink-400 fill-pink-400' : ''}`} 
                        />
                        {favorite ? 'Saved to favorites' : 'Save to favorites'}
                      </Button>
                      
                      {onShopNow && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={onShopNow}
                          className="border-white/10 text-white/70 hover:text-white"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Shop this look
                        </Button>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                        disabled={rating === 0}
                        onClick={handleSubmit}
                      >
                        Submit Feedback
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackLoop;
