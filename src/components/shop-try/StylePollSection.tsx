
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Heart, BadgeCheck } from 'lucide-react';

interface StylePollSectionProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
}

interface PollItem {
  id: string;
  image: string;
  title: string;
  creator: string;
  votes: number;
}

const StylePollSection = ({
  isPremiumUser,
  onUpgradeToPremium
}: StylePollSectionProps) => {
  const [pollItems, setPollItems] = useState<PollItem[]>([
    {
      id: 'poll-1',
      image: 'https://images.unsplash.com/photo-1603189343302-e603f7add05f?auto=format&fit=crop&q=80&w=400&h=500',
      title: 'Parisian Chic',
      creator: '@styleQueen',
      votes: 127
    },
    {
      id: 'poll-2',
      image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=400&h=500',
      title: 'NYC Downtown',
      creator: '@fashionista22',
      votes: 142
    }
  ]);
  
  const [votedId, setVotedId] = useState<string | null>(null);
  
  const handleVote = (id: string) => {
    if (votedId) return; // Already voted
    
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    
    setPollItems(items => 
      items.map(item => 
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    );
    
    setVotedId(id);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-16"
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Vote Your Favorite Fit
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pollItems.map((item) => (
          <Card 
            key={item.id}
            className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                <div className="flex items-center text-white/80 text-sm">
                  <BadgeCheck className="h-3.5 w-3.5 mr-1 text-blue-400" />
                  <span>{item.creator}</span>
                </div>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-pink-500 mr-2" />
                  <span className="text-white font-semibold">{item.votes} votes</span>
                </div>
                
                <Button
                  onClick={() => handleVote(item.id)}
                  disabled={votedId !== null}
                  variant={votedId === item.id ? "default" : "outline"}
                  className={`
                    ${votedId === item.id 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-500' 
                      : 'border-white/20 hover:bg-white/10'}
                  `}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {votedId === item.id ? 'Voted!' : 'Vote This Look'}
                </Button>
              </div>
              
              {votedId && (
                <div className="mt-3 bg-white/10 rounded-lg p-2">
                  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round((item.votes / (pollItems[0].votes + pollItems[1].votes)) * 100)}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full ${item.id === 'poll-1' ? 'bg-pink-500' : 'bg-blue-500'}`}
                    />
                  </div>
                  <div className="text-right text-xs text-white/70 mt-1">
                    {Math.round((item.votes / (pollItems[0].votes + pollItems[1].votes)) * 100)}%
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default StylePollSection;
