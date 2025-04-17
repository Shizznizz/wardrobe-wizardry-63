
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shirt, Lock } from 'lucide-react';
import { ClothingItem } from '@/lib/types';

interface StyleMoodSelectorProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const StyleMoodSelector = ({
  isPremiumUser,
  onTryItem,
  onUpgradeToPremium
}: StyleMoodSelectorProps) => {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  
  const moods = [
    { id: 'casual', label: 'Everyday Casual', color: 'from-blue-500 to-teal-500' },
    { id: 'formal', label: 'Work & Formal', color: 'from-purple-500 to-indigo-500' },
    { id: 'night', label: 'Night Out', color: 'from-pink-500 to-purple-500' },
    { id: 'weekend', label: 'Weekend Vibes', color: 'from-amber-500 to-orange-500' },
    { id: 'athletic', label: 'Athletic', color: 'from-green-500 to-emerald-500' }
  ];
  
  // Example clothing items for each mood
  const moodItems: Record<string, ClothingItem[]> = {
    casual: [
      {
        id: 'casual-1',
        name: 'Classic White Tee',
        type: 'shirt',
        color: 'white',
        material: 'cotton',
        season: ['all'],
        occasions: ['casual'],
        imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=300&h=400',
        image: '/placeholder.svg', // Added required image property
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date()
      }
    ],
    formal: [
      {
        id: 'formal-1',
        name: 'Slim Fit Blazer',
        type: 'jacket',
        color: 'black',
        material: 'wool',
        season: ['autumn', 'winter', 'spring'],
        occasions: ['formal', 'work'],
        imageUrl: 'https://images.unsplash.com/photo-1598808503746-f34cfbb3f1f5?auto=format&fit=crop&q=80&w=300&h=400',
        image: '/placeholder.svg', // Added required image property
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date()
      }
    ]
  };
  
  const handleSelectMood = (moodId: string) => {
    setActiveMood(moodId === activeMood ? null : moodId);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          What's Your Mood Today?
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {moods.map((mood) => (
          <motion.button
            key={mood.id}
            onClick={() => handleSelectMood(mood.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`relative rounded-lg overflow-hidden ${
              activeMood === mood.id 
                ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-slate-900' 
                : 'ring-1 ring-white/10'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-60`}></div>
            <div className="relative p-4 text-center">
              <span className="font-medium text-white">{mood.label}</span>
            </div>
            
            {!isPremiumUser && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <Lock className="text-white h-5 w-5" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
      
      {activeMood && isPremiumUser && moodItems[activeMood] && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
          {moodItems[activeMood].map((item) => (
            <Card key={item.id} className="overflow-hidden bg-slate-800/50 border-white/10">
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                <h3 className="text-sm font-medium text-white mb-2">{item.name}</h3>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                  onClick={() => onTryItem(item)}
                >
                  <Shirt className="h-3.5 w-3.5 mr-1.5" />
                  Try On
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!isPremiumUser && (
        <div className="flex justify-center mt-6">
          <Button 
            onClick={onUpgradeToPremium}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            Unlock Mood-Based Styling
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default StyleMoodSelector;
