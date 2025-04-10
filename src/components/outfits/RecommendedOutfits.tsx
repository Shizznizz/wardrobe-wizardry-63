
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Heart,
  Users,
  ThumbsUp,
  MessageSquare,
  Share2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface UserOutfit {
  id: string;
  username: string;
  avatarUrl: string;
  outfitImageUrl: string;
  description: string;
  likes: number;
  comments: number;
  userLiked: boolean;
}

const dummyOutfits: UserOutfit[] = [
  {
    id: '1',
    username: 'stylish_emma',
    avatarUrl: '/placeholder.svg',
    outfitImageUrl: '/placeholder.svg',
    description: 'Perfect for fall days! This casual yet elegant combination works for both office and weekend outings.',
    likes: 245,
    comments: 18,
    userLiked: false
  },
  {
    id: '2',
    username: 'fashion_james',
    avatarUrl: '/placeholder.svg',
    outfitImageUrl: '/placeholder.svg',
    description: 'My go-to business casual look that always gets compliments. The colors complement each other perfectly.',
    likes: 187,
    comments: 24,
    userLiked: true
  }
];

interface RecommendedOutfitsProps {
  className?: string;
}

const RecommendedOutfits = ({ className }: RecommendedOutfitsProps) => {
  const [outfits, setOutfits] = useState(dummyOutfits);
  
  const handleLikeOutfit = (outfitId: string) => {
    setOutfits(outfits.map(outfit => {
      if (outfit.id === outfitId) {
        const wasLiked = outfit.userLiked;
        return {
          ...outfit,
          userLiked: !wasLiked,
          likes: wasLiked ? outfit.likes - 1 : outfit.likes + 1
        };
      }
      return outfit;
    }));
  };
  
  const handleTryOutfit = (outfitId: string) => {
    toast.success('Loading outfit to try on...');
  };
  
  const handleShareOutfit = (outfitId: string) => {
    toast.success('Sharing options opened');
  };
  
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">Liked by People Like You</h2>
      </div>
      
      <div className="space-y-4">
        {outfits.map((outfit, index) => (
          <motion.div
            key={outfit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="overflow-hidden border-white/10 bg-slate-900/40 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={outfit.avatarUrl} alt={outfit.username} />
                    <AvatarFallback className="bg-purple-600 text-white">
                      {outfit.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">{outfit.username}</p>
                  </div>
                </div>
                
                <div className="mb-3 rounded-lg overflow-hidden">
                  <img 
                    src={outfit.outfitImageUrl} 
                    alt="Outfit" 
                    className="w-full aspect-square object-cover"
                  />
                </div>
                
                <div className="mb-3">
                  <p className="text-white/90 text-sm">{outfit.description}</p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <button 
                      className="flex items-center gap-1 text-white/80 hover:text-white"
                      onClick={() => handleLikeOutfit(outfit.id)}
                    >
                      <Heart className={`h-5 w-5 ${outfit.userLiked ? 'text-red-500 fill-red-500' : ''}`} />
                      <span className="text-sm">{outfit.likes}</span>
                    </button>
                    
                    <button className="flex items-center gap-1 text-white/80 hover:text-white">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-sm">{outfit.comments}</span>
                    </button>
                    
                    <button 
                      className="flex items-center gap-1 text-white/80 hover:text-white"
                      onClick={() => handleShareOutfit(outfit.id)}
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
                  onClick={() => handleTryOutfit(outfit.id)}
                >
                  Try This Look
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedOutfits;
