
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Heart, Trash2, User, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Outfit, ClothingItem } from '@/lib/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface OutfitCollectionSectionProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
}

const OutfitCollectionSection = ({ outfits, clothingItems }: OutfitCollectionSectionProps) => {
  const navigate = useNavigate();
  const [season, setSeason] = useState<string>('all');
  const [occasion, setOccasion] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  
  // Filter outfits based on selected criteria
  const filteredOutfits = outfits.filter(outfit => {
    // Filter by search term
    if (searchTerm && !outfit.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by season
    if (season !== 'all' && outfit.seasons && !outfit.seasons.includes(season)) {
      return false;
    }
    
    // Filter by occasion
    if (occasion !== 'all' && outfit.tags && !outfit.tags.includes(occasion)) {
      return false;
    }
    
    return true;
  });
  
  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    toast.success(favorites[id] ? 'Removed from favorites' : 'Added to favorites');
  };
  
  const handleRemoveOutfit = (id: string) => {
    toast.success('Outfit removed from your wardrobe');
  };
  
  const handleViewDetails = (outfit: Outfit) => {
    toast.success('Viewing outfit details');
  };
  
  const handleTryOnOlivia = (outfit: Outfit) => {
    navigate('/fitting-room', { state: { outfitId: outfit.id } });
  };
  
  const handleCreateOutfit = () => {
    toast.success('Creating new outfit');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-white">
          My Outfit Collection
        </h2>
        
        <Button 
          onClick={handleCreateOutfit}
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Outfit
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2">
          <Input
            placeholder="Search outfits by name..."
            className="bg-slate-800/50 border-slate-700/50 text-white"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            prefix={<Search className="h-4 w-4 text-white/50" />}
          />
        </div>
        
        <Select value={season} onValueChange={setSeason}>
          <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
            <SelectValue placeholder="Season" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700/50">
            <SelectItem value="all">All Seasons</SelectItem>
            <SelectItem value="spring">Spring</SelectItem>
            <SelectItem value="summer">Summer</SelectItem>
            <SelectItem value="autumn">Autumn</SelectItem>
            <SelectItem value="winter">Winter</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={occasion} onValueChange={setOccasion}>
          <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
            <SelectValue placeholder="Occasion" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700/50">
            <SelectItem value="all">All Occasions</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="party">Party</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredOutfits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOutfits.map(outfit => {
            // Find a clothing item to use as the main image
            const mainItem = clothingItems.find(item => 
              outfit.items && outfit.items.includes(item.id)
            );
            
            return (
              <motion.div
                key={outfit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-slate-900/50 border-white/10 hover:border-purple-500/30 transition-colors h-full flex flex-col">
                  <div className="relative aspect-square overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
                    <img 
                      src={mainItem?.imageUrl || '/placeholder.svg'} 
                      alt={outfit.name}
                      className="w-full h-full object-cover"
                    />
                    <button 
                      className="absolute top-3 right-3 z-20 p-1.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                      onClick={() => handleToggleFavorite(outfit.id)}
                    >
                      <Heart 
                        className={`h-5 w-5 ${favorites[outfit.id] ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                      />
                    </button>
                    
                    <div className="absolute bottom-3 left-3 z-20">
                      <h3 className="text-lg font-medium text-white mb-1">
                        {outfit.name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {outfit.tags?.slice(0, 3).map((tag, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline" 
                            className="bg-purple-500/20 border-purple-400/30 text-purple-200 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <CardFooter className="p-3 grid grid-cols-3 gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 w-full"
                      onClick={() => handleViewDetails(outfit)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 w-full"
                      onClick={() => handleTryOnOlivia(outfit)}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 w-full"
                      onClick={() => handleRemoveOutfit(outfit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-800/50 rounded-xl border border-white/10 p-8 text-center">
          <p className="text-white/70">No outfits match your filters.</p>
          <Button
            variant="outline"
            className="mt-4 border-white/20 text-white hover:bg-white/10"
            onClick={() => {
              setSeason('all');
              setOccasion('all');
              setSearchTerm('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default OutfitCollectionSection;
