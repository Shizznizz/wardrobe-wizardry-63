
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Outfit, ClothingItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, StarOff } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface OutfitCollectionPreviewProps {
  title: string;
  description?: string;
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  viewAllLink?: string;
}

const OutfitCollectionPreview = ({
  title,
  description,
  outfits,
  clothingItems,
  viewAllLink
}: OutfitCollectionPreviewProps) => {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  
  if (!outfits.length) {
    return null;
  }
  
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = { ...prev, [id]: !prev[id] };
      
      if (newFavorites[id]) {
        toast.success("Added to favorites", {
          description: "Outfit added to your favorites collection"
        });
      } else {
        toast.success("Removed from favorites", {
          description: "Outfit removed from your favorites collection"
        });
      }
      
      return newFavorites;
    });
  };
  
  const getOutfitImage = (outfit: Outfit): string => {
    if (!outfit.items || !outfit.items.length) return '/placeholder.svg';
    
    const firstItemId = outfit.items[0];
    const item = clothingItems.find(item => item.id === firstItemId);
    return item?.imageUrl || '/placeholder.svg';
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {description && <p className="text-sm text-white/70">{description}</p>}
        </div>
        
        {viewAllLink && (
          <Button variant="ghost" size="sm" asChild className="text-purple-400 hover:text-purple-300 hover:bg-purple-950/30">
            <Link to={viewAllLink}>
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {outfits.slice(0, 4).map((outfit) => (
          <motion.div key={outfit.id} variants={item}>
            <Card className="border-white/10 bg-slate-800/50 backdrop-blur-sm text-white shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium">{outfit.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-950/30"
                    onClick={() => toggleFavorite(outfit.id)}
                  >
                    {favorites[outfit.id] ? (
                      <Star className="h-5 w-5 fill-yellow-400" />
                    ) : (
                      <StarOff className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="relative h-48 w-full mb-3 overflow-hidden rounded-md">
                  <img
                    src={getOutfitImage(outfit)}
                    alt={outfit.name}
                    className="object-cover h-full w-full transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {outfit.seasons.map((season) => (
                    <Badge
                      key={season}
                      variant="outline"
                      className="bg-purple-950/40 text-purple-300 border-purple-500/30 text-xs"
                    >
                      {season}
                    </Badge>
                  ))}
                  {outfit.occasions.slice(0, 1).map((occasion) => (
                    <Badge
                      key={occasion}
                      variant="outline"
                      className="bg-blue-950/40 text-blue-300 border-blue-500/30 text-xs"
                    >
                      {occasion}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-600 hover:to-purple-600"
                >
                  Try this look
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default OutfitCollectionPreview;
