
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, ThumbsDown, Heart, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackLoopProps {
  visible: boolean;
  outfitName: string;
  onClose: () => void;
  onFeedbackSubmit: (feedback: FeedbackData) => void;
}

export interface FeedbackData {
  rating: number; 
  fit: 'good' | 'bad' | null;
  favorite: boolean;
  outfitName: string;
}

const FeedbackLoop = ({
  visible,
  outfitName,
  onClose,
  onFeedbackSubmit
}: FeedbackLoopProps) => {
  const [rating, setRating] = useState<number>(0);
  const [fit, setFit] = useState<'good' | 'bad' | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  if (!visible) return null;
  
  const handleRatingSelect = (value: number) => {
    setRating(value);
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
    toast.success('Thanks for your feedback!');
    
    // Reset and close after a timeout
    setTimeout(() => {
      setRating(0);
      setFit(null);
      setFavorite(false);
      setSubmitted(false);
      onClose();
    }, 1500);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card className="border-white/10 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
        <CardContent className="p-4">
          {submitted ? (
            <div className="py-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white">Thank you for your feedback!</h3>
              <p className="text-white/70 text-sm mt-1">
                Olivia's AI will learn from your preferences to improve future suggestions.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">How was this look?</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/50 hover:text-white h-8 w-8 p-0"
                  onClick={onClose}
                >
                  &times;
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white/70 mb-2">Rate your experience with {outfitName}</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        className="p-1"
                        onClick={() => handleRatingSelect(value)}
                      >
                        <Star 
                          className={`h-8 w-8 transition-colors ${
                            value <= rating 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-white/20 hover:text-white/40'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-white/70 mb-2">How was the fit?</p>
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
                      Good fit
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
                      Bad fit
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className={`border-white/10 ${
                      favorite 
                        ? 'bg-pink-900/30 text-pink-400 border-pink-400/30' 
                        : 'text-white/70 hover:text-white'
                    }`}
                    onClick={() => setFavorite(!favorite)}
                  >
                    <Heart 
                      className={`h-4 w-4 mr-2 ${favorite ? 'text-pink-400 fill-pink-400' : ''}`} 
                    />
                    {favorite ? 'Saved to favorites' : 'Add to favorites'}
                  </Button>
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
  );
};

export default FeedbackLoop;
