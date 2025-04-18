
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ThumbsUp, ThumbsDown, Heart, Share2, Save, Send, Lock } from 'lucide-react';
import { FeedbackData } from './FeedbackData';

interface FeedbackLoopProps {
  visible: boolean;
  outfitName: string;
  onClose: () => void;
  onFeedbackSubmit: (data: FeedbackData) => void;
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
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [favorite, setFavorite] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [shareOnSocial, setShareOnSocial] = useState<boolean>(false);
  
  const availableTags = [
    'Perfect Fit', 'Color Works', 'Matches Style', 'Flattering', 'Unique', 
    'Too Casual', 'Too Formal', 'Wrong Color', 'Not My Style'
  ];
  
  const handleSubmit = () => {
    const feedback: FeedbackData = {
      rating,
      comment,
      favorite,
      tags: selectedTags,
      shareOnSocial
    };
    
    onFeedbackSubmit(feedback);
    onClose();
  };
  
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <Card className="border-white/10 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">How does {outfitName} look?</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full text-white/70 hover:text-white"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <p className="text-white/80 text-sm mb-2">Rate this look:</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          rating >= star ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/40 hover:bg-white/20'
                        }`}
                        onClick={() => setRating(star)}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-white/80 text-sm mb-2">Quick tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          selectedTags.includes(tag)
                            ? tag.startsWith('Too') || tag.startsWith('Wrong') || tag.startsWith('Not')
                              ? 'bg-red-500/20 text-red-200 border border-red-500/40'
                              : 'bg-green-500/20 text-green-200 border border-green-500/40'
                            : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                        }`}
                        onClick={() => handleTagSelect(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-white/80 text-sm mb-2">Additional feedback (optional):</p>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us more about this look..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    rows={2}
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline"
                    className={`border-white/20 hover:bg-white/10 ${favorite ? 'bg-pink-900/30 border-pink-500/40 text-pink-200' : 'text-white'}`}
                    onClick={() => setFavorite(!favorite)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${favorite ? 'fill-pink-200' : ''}`} />
                    {favorite ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className={`border-white/20 hover:bg-white/10 ${shareOnSocial ? 'bg-blue-900/30 border-blue-500/40 text-blue-200' : 'text-white'}`}
                    onClick={() => setShareOnSocial(!shareOnSocial)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {shareOnSocial ? 'Will Share' : 'Share to Socials'}
                  </Button>
                  
                  {isPremium ? (
                    <Button 
                      variant="outline"
                      className="border-white/20 hover:bg-white/10 text-white"
                      onClick={onSave}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Look
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      className="border-purple-500/30 hover:bg-purple-900/20 text-purple-200"
                      onClick={onUpgradeToPremium}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Unlock to Save
                    </Button>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                    onClick={handleSubmit}
                    disabled={rating === 0}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackLoop;
