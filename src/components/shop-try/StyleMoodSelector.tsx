
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Briefcase, Coffee, MinusCircle, Flame, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ClothingItem } from '@/lib/types';

interface StyleMoodSelectorProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

interface MoodOption {
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface MoodOutfit extends ClothingItem {
  brand: string;
  description: string;
}

const StyleMoodSelector = ({
  isPremiumUser,
  onTryItem,
  onUpgradeToPremium
}: StyleMoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const moods: MoodOption[] = [
    { name: "Romantic", icon: <Heart className="h-4 w-4" />, color: "from-pink-500 to-red-400" },
    { name: "Power Boss", icon: <Briefcase className="h-4 w-4" />, color: "from-indigo-500 to-blue-400" },
    { name: "Cozy", icon: <Coffee className="h-4 w-4" />, color: "from-amber-500 to-yellow-400" },
    { name: "Minimal", icon: <MinusCircle className="h-4 w-4" />, color: "from-slate-500 to-gray-400" },
    { name: "Festival", icon: <Flame className="h-4 w-4" />, color: "from-purple-500 to-pink-400" },
    { name: "Streetstyle", icon: <Truck className="h-4 w-4" />, color: "from-emerald-500 to-green-400" }
  ];
  
  // Sample outfits based on mood
  const moodOutfits: Record<string, MoodOutfit[]> = {
    "Romantic": [
      {
        id: 'romantic-1',
        name: 'Floral Maxi Dress',
        type: 'dress',
        seasons: ['spring', 'summer'],
        color: 'pink',
        material: 'silk',
        occasions: ['date', 'casual'],
        imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=300&h=400',
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date(),
        brand: 'Free People',
        description: 'Soft, flowing fabric with delicate floral pattern'
      }
    ],
    "Power Boss": [
      {
        id: 'boss-1',
        name: 'Structured Blazer Suit',
        type: 'jacket',
        seasons: ['all'],
        color: 'black',
        material: 'cotton',
        occasions: ['business', 'formal'],
        imageUrl: 'https://images.unsplash.com/photo-1632149877166-f75d49000351?auto=format&fit=crop&q=80&w=300&h=400',
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date(),
        brand: 'Theory',
        description: 'Powerful silhouette with strong shoulders'
      }
    ],
    "Cozy": [
      {
        id: 'cozy-1',
        name: 'Oversized Cardigan',
        type: 'sweater',
        seasons: ['autumn', 'winter'],
        color: 'brown',
        material: 'wool',
        occasions: ['casual'],
        imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=300&h=400',
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date(),
        brand: 'Anthropologie',
        description: 'Chunky knit that feels like a warm hug'
      }
    ],
    "Minimal": [
      {
        id: 'minimal-1',
        name: 'Tailored White Shirt',
        type: 'shirt',
        seasons: ['all'],
        color: 'white',
        material: 'cotton',
        occasions: ['casual', 'business'],
        imageUrl: 'https://images.unsplash.com/photo-1604644401890-0bd678c83788?auto=format&fit=crop&q=80&w=300&h=400',
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date(),
        brand: 'Everlane',
        description: 'Clean lines with perfect proportions'
      }
    ],
    "Festival": [
      {
        id: 'festival-1',
        name: 'Fringe Suede Vest',
        type: 'jacket',
        seasons: ['summer'],
        color: 'brown',
        material: 'leather',
        occasions: ['party', 'casual'],
        imageUrl: 'https://images.unsplash.com/photo-1583744946564-b52d01e7f922?auto=format&fit=crop&q=80&w=300&h=400',
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date(),
        brand: 'Free People',
        description: 'Statement piece with movement and texture'
      }
    ],
    "Streetstyle": [
      {
        id: 'street-1',
        name: 'Oversized Graphic Hoodie',
        type: 'hoodie',
        seasons: ['autumn', 'winter'],
        color: 'black',
        material: 'cotton',
        occasions: ['casual'],
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=300&h=400',
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date(),
        brand: 'Supreme',
        description: 'Urban cool with statement graphics'
      }
    ]
  };
  
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
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
          What's Your Mood Today?
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {moods.map((mood) => (
          <Button
            key={mood.name}
            onClick={() => handleMoodSelect(mood.name)}
            className={`h-auto py-3 flex flex-col items-center bg-gradient-to-br ${mood.color} hover:opacity-90 ${selectedMood === mood.name ? 'ring-2 ring-white' : ''}`}
          >
            <span className="mb-1">{mood.icon}</span>
            <span className="text-xs">{mood.name}</span>
          </Button>
        ))}
      </div>
      
      {selectedMood && moodOutfits[selectedMood] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
        >
          {moodOutfits[selectedMood].map((outfit) => (
            <Card key={outfit.id} className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden">
              <div className="aspect-[3/4] relative overflow-hidden">
                <img 
                  src={outfit.imageUrl} 
                  alt={outfit.name} 
                  className="w-full h-full object-cover"
                />
                
                {!isPremiumUser && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    <p className="text-white font-medium text-center mb-2">Premium Feature</p>
                    <Button 
                      size="sm"
                      onClick={onUpgradeToPremium}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                    >
                      Unlock Now
                    </Button>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-white">{outfit.name}</h3>
                <p className="text-sm text-white/70 mb-3">{outfit.description}</p>
                
                <Button 
                  onClick={() => onTryItem(outfit)}
                  disabled={!isPremiumUser}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
                >
                  Try This Mood
                </Button>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default StyleMoodSelector;
