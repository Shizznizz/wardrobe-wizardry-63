
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Trash2, Eye, Calendar, ArrowRightCircle, Star, Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Outfit, ClothingItem } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

interface OutfitCollectionSectionProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
}

const OutfitCollectionSection = ({ outfits, clothingItems }: OutfitCollectionSectionProps) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  
  const filteredOutfits = outfits.filter(outfit => {
    // Filter by search query
    const matchesSearch = outfit.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by favorite if enabled
    const matchesFavorite = favoriteFilter ? outfit.favorite : true;
    
    // Filter by category
    const matchesCategory = selectedCategory === "all" || 
      (outfit.seasons && outfit.seasons.includes(selectedCategory)) ||
      (outfit.occasions && outfit.occasions.includes(selectedCategory));
    
    return matchesSearch && matchesFavorite && matchesCategory;
  });
  
  const handleToggleFavorite = (outfit: Outfit, event: React.MouseEvent) => {
    event.stopPropagation();
    // In real app, this would update the database
    toast.success(outfit.favorite 
      ? `Removed ${outfit.name} from favorites` 
      : `Added ${outfit.name} to favorites`
    );
  };
  
  const handleViewDetails = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
  };
  
  const handleRemoveOutfit = (outfit: Outfit, event: React.MouseEvent) => {
    event.stopPropagation();
    toast.success(`Removed ${outfit.name} from your collection`);
  };
  
  const handleTryOn = (outfit: Outfit, event: React.MouseEvent) => {
    event.stopPropagation();
    toast.success(`Opening ${outfit.name} in fitting room`);
    navigate('/fitting-room');
  };
  
  const getOutfitItemImage = (outfit: Outfit): string => {
    if (!outfit.items || outfit.items.length === 0) return '/placeholder.svg';
    
    const firstItemId = outfit.items[0];
    const item = clothingItems.find(item => item.id === firstItemId);
    
    return item?.imageUrl || '/placeholder.svg';
  };
  
  const categoryOptions = [
    { value: "all", label: "All" },
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "autumn", label: "Fall" },
    { value: "winter", label: "Winter" },
    { value: "casual", label: "Casual" },
    { value: "work", label: "Work" },
    { value: "party", label: "Party" }
  ];
  
  const handleCreateNewOutfit = () => {
    toast.success("Let's create a new outfit!");
    // Scroll to create outfit section
    document.getElementById("create-outfit-section")?.scrollIntoView({ behavior: "smooth" });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          My Outfit Collection
        </h2>
        
        <Button
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={handleCreateNewOutfit}
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Outfit
        </Button>
      </div>
      
      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/60" />
          <Input
            className="w-full pl-9 bg-white/5 border-white/20 text-white"
            placeholder="Search outfits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex">
          <Button
            variant="outline"
            className={`border-white/20 text-white hover:bg-white/10 ${favoriteFilter ? 'bg-white/10' : ''}`}
            onClick={() => setFavoriteFilter(!favoriteFilter)}
          >
            <Heart className={`mr-2 h-4 w-4 ${favoriteFilter ? 'fill-pink-500 text-pink-500' : ''}`} /> 
            Favorites
          </Button>
          
          <TabsList className="ml-2 bg-white/5">
            {categoryOptions.slice(0, 3).map(option => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className={selectedCategory === option.value ? 'bg-white/10 text-white' : 'text-white/70'}
                onClick={() => setSelectedCategory(option.value)}
              >
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <div className="flex">
          <TabsList className="bg-white/5">
            {categoryOptions.slice(3, 7).map(option => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className={selectedCategory === option.value ? 'bg-white/10 text-white' : 'text-white/70'}
                onClick={() => setSelectedCategory(option.value)}
              >
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>
      
      {/* Outfits Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredOutfits.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-white/70 mb-3">No outfits match your filters</p>
            <Button 
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                setSearchQuery("");
                setFavoriteFilter(false);
                setSelectedCategory("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          filteredOutfits.map(outfit => (
            <Card 
              key={outfit.id}
              className="bg-slate-900/60 border-white/10 overflow-hidden hover:border-white/30 transition-all cursor-pointer hover:shadow-lg"
              onClick={() => handleViewDetails(outfit)}
            >
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={getOutfitItemImage(outfit)} 
                  alt={outfit.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
                
                <button 
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                  onClick={(e) => handleToggleFavorite(outfit, e)}
                >
                  <Heart className={`h-4 w-4 ${outfit.favorite ? 'fill-pink-500 text-pink-500' : 'text-white'}`} />
                </button>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <h3 className="text-white font-medium text-sm truncate">{outfit.name}</h3>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {outfit.seasons && outfit.seasons.slice(0, 2).map((season, index) => (
                      <Badge key={index} variant="outline" className="border-white/20 text-white/90 text-[10px] py-0 px-1.5">
                        {season}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <CardContent className="p-3">
                <div className="grid grid-cols-3 gap-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 p-0"
                    onClick={(e) => handleViewDetails(outfit)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 p-0"
                    onClick={(e) => handleTryOn(outfit, e)}
                  >
                    <ArrowRightCircle className="h-3.5 w-3.5" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/20 text-white hover:bg-red-500/10 p-0"
                    onClick={(e) => handleRemoveOutfit(outfit, e)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Outfit Details Dialog */}
      <Dialog open={!!selectedOutfit} onOpenChange={(open) => !open && setSelectedOutfit(null)}>
        <DialogContent className="bg-slate-900/95 border-white/20 text-white max-w-2xl">
          {selectedOutfit && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedOutfit.name}</DialogTitle>
                <DialogDescription>
                  Created on {selectedOutfit.createdAt ? new Date(selectedOutfit.createdAt).toLocaleDateString() : 'unknown date'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={getOutfitItemImage(selectedOutfit)} 
                    alt={selectedOutfit.name}
                    className="w-full aspect-square object-cover rounded-md"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-white/70 mb-1">Seasons:</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedOutfit.seasons && selectedOutfit.seasons.map((season, index) => (
                        <Badge key={index} className="bg-purple-600">
                          {season}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {selectedOutfit.occasions && (
                    <div>
                      <h4 className="text-sm font-medium text-white/70 mb-1">Occasions:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedOutfit.occasions.map((occasion, index) => (
                          <Badge key={index} variant="outline" className="border-pink-400/30 text-white">
                            {occasion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-white/70 mb-1">Items:</h4>
                    <div className="space-y-2">
                      {selectedOutfit.items.map((itemId, index) => {
                        const item = clothingItems.find(item => item.id === itemId);
                        
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-white/10 rounded overflow-hidden">
                              {item && (
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <span className="text-sm text-white/90">{item?.name || 'Unknown item'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    toast.success(`Opening ${selectedOutfit.name} in fitting room`);
                    navigate('/fitting-room');
                    setSelectedOutfit(null);
                  }}
                >
                  <ArrowRightCircle className="mr-2 h-4 w-4" /> Try on Olivia
                </Button>
                
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    toast.success(`Added ${selectedOutfit.name} to your calendar`);
                    setSelectedOutfit(null);
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" /> Add to Calendar
                </Button>
                
                <Button
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  onClick={() => {
                    toast.success(`Removed ${selectedOutfit.name} from your collection`);
                    setSelectedOutfit(null);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Remove Outfit
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OutfitCollectionSection;
