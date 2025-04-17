
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Smile, Meh, Frown, Heart, Lock, ThumbsUp, ThumbsDown, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FeedbackData } from './FeedbackData';

interface FeedbackLoopProps {
  visible: boolean;
  outfitName: string;
  onClose: () => void;
  onFeedbackSubmit: (feedback: FeedbackData) => void;
  onSave: () => void;
  isPremium: boolean;
  onUpgradeToPremium: () => void;
}

const FeedbackLoop = ({
  visible,
  outfitName,
  onClose,
  onFeedbackSubmit,
  onSave,
  isPremium,
  onUpgradeToPremium
}: FeedbackLoopProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [accuracy, setAccuracy] = useState<'good' | 'ok' | 'poor' | null>(null);
  
  const handleSubmit = () => {
    onFeedbackSubmit({
      rating,
      favorite: isFavorite,
      comment: comment.trim() || undefined,
      accuracy: accuracy || undefined
    });
    onClose();
  };
  
  if (!visible) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="my-6"
      >
        <Card className="border-purple-500/20 bg-gradient-to-r from-gray-900/90 to-purple-950/90 p-4 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-medium text-white">How did you like this look?</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white/70 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm text-white/70">Rate {outfitName}:</p>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button 
                      key={star}
                      variant="ghost" 
                      size="sm"
                      className={`h-8 w-8 p-0 ${
                        rating >= star ? 'text-yellow-400' : 'text-white/30 hover:text-white/50'
                      }`}
                      onClick={() => setRating(star)}
                    >
                      <Star className="h-5 w-5" fill={rating >= star ? 'currentColor' : 'none'} />
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="mb-2 text-sm text-white/70">How accurate is the fit?</p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 border-white/20 ${
                      accuracy === 'good' 
                        ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                        : 'bg-transparent text-white/70'
                    }`}
                    onClick={() => setAccuracy('good')}
                  >
                    <ThumbsUp className={`mr-1 h-3 w-3 ${accuracy === 'good' ? 'text-green-300' : ''}`} />
                    Good
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 border-white/20 ${
                      accuracy === 'ok' 
                        ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' 
                        : 'bg-transparent text-white/70'
                    }`}
                    onClick={() => setAccuracy('ok')}
                  >
                    <Meh className={`mr-1 h-3 w-3 ${accuracy === 'ok' ? 'text-yellow-300' : ''}`} />
                    OK
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 border-white/20 ${
                      accuracy === 'poor' 
                        ? 'bg-red-500/20 border-red-500/30 text-red-300' 
                        : 'bg-transparent text-white/70'
                    }`}
                    onClick={() => setAccuracy('poor')}
                  >
                    <ThumbsDown className={`mr-1 h-3 w-3 ${accuracy === 'poor' ? 'text-red-300' : ''}`} />
                    Poor
                  </Button>
                </div>
              </div>
              
              <div>
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  size="sm"
                  className={`mt-2 ${
                    isFavorite 
                      ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                      : 'border-white/20 text-white/70 hover:text-white hover:bg-pink-500/10'
                  }`}
                  onClick={() => {
                    if (!isPremium) {
                      onUpgradeToPremium();
                      return;
                    }
                    setIsFavorite(!isFavorite);
                  }}
                >
                  {!isPremium && <Lock className="mr-1 h-3 w-3" />}
                  <Heart className={`mr-1 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm text-white/70">Share your thoughts (optional):</p>
                <Textarea
                  placeholder="Tell us what you think..."
                  className="h-20 border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-purple-500/50"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                  onClick={onClose}
                >
                  Skip
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                  size="sm"
                >
                  <Send className="mr-1 h-3 w-3" />
                  Send Feedback
                </Button>
              </div>
              
              {!isPremium && (
                <div className="mt-4 text-xs text-white/60">
                  <p>
                    <span className="font-medium text-purple-400">✨ Premium users</span> can save looks to their personal collection and access advanced fitting options.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackLoop;
