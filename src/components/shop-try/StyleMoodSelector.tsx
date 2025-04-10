import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Sparkles, Coffee, Music, Leaf, Heart, Clock } from 'lucide-react';
import { ClothingItem } from '@/lib/types';
import { toast } from 'sonner';

interface StyleMoodSelectorProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

interface Mood {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const StyleMoodSelector = ({
  isPremiumUser,
  onTryItem,
  onUpgradeToPremium
}: StyleMoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [outfitItems, setOutfitItems] = useState<ClothingItem[]>([]);
  
  const moods: Mood[] = [
    {
      id: 'romantic',
      name: 'Romantic',
      icon: <Heart className="h-5 w-5" />,
      color: 'from-pink-500 to-red-400',
      description: 'Soft, feminine pieces with floral patterns and delicate details'
    },
    {
      id: 'power-boss',
      name: 'Power Boss',
      icon: <Coffee className="h-5 w-5" />,
      color: 'from-blue-500 to-indigo-500',
      description: 'Structured blazers, tailored pants, and confidence-boosting pieces'
    },
    {
      id: 'cozy',
      name: 'Cozy',
      icon: <Moon className="h-5 w-5" />,
      color: 'from-amber-500 to-yellow-400',
      description: 'Comfortable knits, soft fabrics, and layered warmth'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      icon: <Leaf className="h-5 w-5" />,
      color: 'from-gray-500 to-gray-400',
      description: 'Clean lines, neutral colors, and timeless silhouettes'
    },
    {
      id: 'festival',
      name: 'Festival',
      icon: <Music className="h-5 w-5" />,
      color: 'from-purple-500 to-violet-400',
      description: 'Bold, expressive pieces with vibrant colors and unique textures'
    },
    {
      id: 'streetstyle',
      name: 'Streetstyle',
      icon: <Sparkles className="h-5 w-5" />,
      color: 'from-green-500 to-teal-400',
      description: 'Urban-inspired looks with edgy details and comfortable appeal'
    },
    {
      id: 'date-night',
      name: 'Date Night',
      icon: <Heart className="h-5 w-5" />,
      color: 'from-red-500 to-pink-400',
      description: 'Alluring yet tasteful pieces perfect for special evenings'
    },
    {
      id: 'y2k-rewind',
      name: 'Y2K Rewind',
      icon: <Clock className="h-5 w-5" />,
      color: 'from-cyan-500 to-blue-400',
      description: 'Nostalgic 2000s-inspired fashion with a modern twist'
    }
  ];
  
  const moodOutfits: Record<string, ClothingItem[]> = {
    'romantic': [
      {
        id: 'romantic-1',
        name: 'Floral Wrap Dress',
        type: 'dress',
        seasons: ['spring', 'summer'],
        color: 'pink',
        material: 'silk',
        occasions: ['casual', 'date'],
        imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=300&h=400',
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date()
      },
      {
        id: 'romantic-2',
        name: 'Lace Blouse',
        type: 'top',
        seasons: ['spring', 'summer', 'autumn'],
        color: 'white',
        material: 'cotton',
        occasions: ['casual', 'date'],
        imageUrl: 'https://images.unsplash.com/photo-1561052967-61fc91e48d79?auto=format&fit=crop&q=80&w=300&h=400',
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date()
      }
    ],
    'power-boss': [
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
    'cozy': [
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
    'minimal': [
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
    'festival': [
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
    'streetstyle': [
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
    ],
    'date-night': [
      {
        id: 'date-1',
        name: 'Black Slip Dress',
        type: 'dress',
        seasons: ['all'],
        color: 'black',
        material: 'silk',
        occasions: ['date', 'party'],
        imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=300&h=400',
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date()
      },
      {
        id: 'date-2',
        name: 'Red Statement Top',
        type: 'top',
        seasons: ['all'],
        color: 'red',
        material: 'polyester',
        occasions: ['date', 'party'],
        imageUrl: 'https://images.unsplash.com/photo-1588117260148-b47818741c74?auto=format&fit=crop&q=80&w=300&h=400',
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date()
      }
    ],
    'y2k-rewind': [
      {
        id: 'y2k-1',
        name: 'Low-Rise Jeans',
        type: 'pants',
        seasons: ['all'],
        color: 'blue',
        material: 'denim',
        occasions: ['casual'],
        imageUrl: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&q=80&w=300&h=400',
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date()
      },
      {
        id: 'y2k-2',
        name: 'Baby Tee',
        type: 'top',
        seasons: ['spring', 'summer'],
        color: 'pink',
        material: 'cotton',
        occasions: ['casual'],
        imageUrl: 'https://images.unsplash.com/photo-1578966857993-128d94339476?auto=format&fit=crop&q=80&w=300&h=400',
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date()
      }
    ]
  };
  
  const handleMoodSelect = (moodId: string) => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    
    setSelectedMood(moodId);
    const moodItems = moodOutfits[moodId] || [];
    setOutfitItems(moodItems);
    
    toast.success(`Showing "${moods.find(m => m.id === moodId)?.name}" style suggestions`);
  };
  
  const handleTryItem = (item: ClothingItem) => {
    onTryItem(item);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-16"
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          What's Your Mood Today?
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 mb-8">
        {moods.map((mood) => (
          <motion.div
            key={mood.id}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="relative"
          >
            <Button
              variant="outline"
              className={`w-full h-full py-6 flex flex-col items-center justify-center gap-2 border border-white/10 bg-slate-800/40 hover:bg-slate-700/40 backdrop-blur-sm 
                ${selectedMood === mood.id ? 'ring-2 ring-purple-500 border-transparent' : ''}`}
              onClick={() => handleMoodSelect(mood.id)}
            >
              <div className={`p-2 rounded-full bg-gradient-to-r ${mood.color}`}>
                {mood.icon}
              </div>
              <span className="text-sm font-medium">{mood.name}</span>
            </Button>
            
            {!isPremiumUser && (
              <div className="absolute top-1 right-1">
                <span className="bg-purple-500 text-white text-xs px-1 py-0.5 rounded">PRO</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {selectedMood && outfitItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {outfitItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden h-full">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-white truncate">{item.name}</h3>
                  
                  <Button 
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
                    onClick={() => handleTryItem(item)}
                  >
                    Try on Olivia
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default StyleMoodSelector;
