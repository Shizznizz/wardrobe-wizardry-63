
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OutfitCard } from '@/components/outfits/OutfitCard';
import { cn } from '@/lib/utils';
import { Heart, Clock, Grid3X3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader } from '@/components/ui/card';
import { Outfit, ClothingItem, OutfitLog } from '@/lib/types';
import OutfitBuilder from '@/components/OutfitBuilder';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface OutfitTabSectionProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
}

const OutfitTabSection = ({ outfits, clothingItems }: OutfitTabSectionProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [outfitToEdit, setOutfitToEdit] = useState<Outfit | null>(null);
  const { user } = useAuth();
  const [localOutfits, setLocalOutfits] = useState<Outfit[]>(outfits);
  const [userClothingItems, setUserClothingItems] = useState<ClothingItem[]>(clothingItems);
  
  // Fetch user's clothing items from Supabase when component mounts
  useEffect(() => {
    const fetchUserClothingItems = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('clothing_items')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data) {
          const formattedItems: ClothingItem[] = data.map(item => ({
            id: item.id,
            name: item.name,
            type: item.type,
            color: item.color,
            material: item.material || '',
            season: item.season || ['all'],
            occasions: item.occasions || ['casual'],
            favorite: item.favorite || false,
            imageUrl: item.image_url,
            image: item.image_url,
            timesWorn: item.times_worn || 0,
            dateAdded: new Date(item.date_added)
          }));
          
          setUserClothingItems(formattedItems);
        }
      } catch (error) {
        console.error('Error fetching user clothing items:', error);
      }
    };
    
    fetchUserClothingItems();
  }, [user?.id]);
  
  // Update local outfits when props change
  useEffect(() => {
    setLocalOutfits(outfits);
  }, [outfits]);
  
  const favoriteOutfits = localOutfits.filter(outfit => outfit.favorite);
  const recentOutfits = [...localOutfits].sort((a, b) => {
    const dateA = new Date(a.dateAdded || a.createdAt || new Date()).getTime();
    const dateB = new Date(b.dateAdded || b.createdAt || new Date()).getTime();
    return dateB - dateA;
  }).slice(0, 6);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const getClothingItemById = (id: string): ClothingItem | undefined => {
    // First try to find the item in the user's clothing items from Supabase
    const userItem = userClothingItems.find(item => item && item.id === id);
    if (userItem) return userItem;
    
    // Fallback to the sample clothing items if not found in user items
    return clothingItems.find(item => item && item.id === id);
  };
  
  const handleEdit = (outfit: Outfit) => {
    setOutfitToEdit(outfit);
    setIsBuilderOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    // Remove from local state
    setLocalOutfits(prev => prev.filter(outfit => outfit.id !== id));
    
    // Remove from localStorage
    const savedOutfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
    const updatedOutfits = savedOutfits.filter((outfit: Outfit) => outfit.id !== id);
    localStorage.setItem('savedOutfits', JSON.stringify(updatedOutfits));
    
    // Remove from Supabase if user is logged in
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('outfits')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting outfit from Supabase:', error);
      }
    }
    
    toast.success('Outfit deleted successfully');
  };
  
  const handleToggleFavorite = async (id: string) => {
    // Update in local state
    setLocalOutfits(prev => 
      prev.map(outfit => 
        outfit.id === id ? { ...outfit, favorite: !outfit.favorite } : outfit
      )
    );
    
    // Update in localStorage
    const savedOutfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
    const updatedOutfits = savedOutfits.map((outfit: Outfit) => 
      outfit.id === id ? { ...outfit, favorite: !outfit.favorite } : outfit
    );
    localStorage.setItem('savedOutfits', JSON.stringify(updatedOutfits));
    
    // Update in Supabase if user is logged in
    if (user?.id) {
      // First get the current outfit to toggle the favorite status
      const outfitToToggle = localOutfits.find(outfit => outfit.id === id);
      if (!outfitToToggle) return;
      
      try {
        const { error } = await supabase
          .from('outfits')
          .update({ favorite: !outfitToToggle.favorite })
          .eq('id', id)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error updating outfit in Supabase:', error);
      }
    }
    
    toast.success('Favorite status updated');
  };
  
  const handleOutfitAddedToCalendar = (log: OutfitLog) => {
    toast.success(`Outfit added to your calendar for ${new Date(log.date).toLocaleDateString()}`);
    // Implementation would go here
  };

  const handleUpdateOutfit = async (updatedOutfit: Outfit) => {
    // Update in local state
    setLocalOutfits(prev => 
      prev.map(outfit => 
        outfit.id === updatedOutfit.id ? updatedOutfit : outfit
      )
    );
    
    // Update in localStorage
    const savedOutfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
    const updatedOutfits = savedOutfits.map((outfit: Outfit) => 
      outfit.id === updatedOutfit.id ? updatedOutfit : outfit
    );
    localStorage.setItem('savedOutfits', JSON.stringify(updatedOutfits));
    
    // Update in Supabase if user is logged in
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('outfits')
          .update({
            name: updatedOutfit.name,
            items: updatedOutfit.items,
            season: updatedOutfit.season,
            occasion: updatedOutfit.occasion,
            occasions: updatedOutfit.occasions,
            favorite: updatedOutfit.favorite,
          })
          .eq('id', updatedOutfit.id)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error updating outfit in Supabase:', error);
      }
    }
    
    setIsBuilderOpen(false);
    setOutfitToEdit(null);
    toast.success('Outfit updated successfully');
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  return (
    <Card className="border border-white/20 bg-slate-900/50 backdrop-blur-md pt-4 pb-6 px-4">
      <CardHeader className="pb-2">
        <h2 className="text-2xl font-semibold text-white">My Collection</h2>
      </CardHeader>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full bg-slate-800/60 mb-6">
          <TabsTrigger 
            value="all"
            className={cn(
              "flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white",
              "flex items-center justify-center gap-2 transition-all duration-300"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
            All Outfits
          </TabsTrigger>
          <TabsTrigger 
            value="favorites"
            className={cn(
              "flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white",
              "flex items-center justify-center gap-2 transition-all duration-300"
            )}
          >
            <Heart className="h-4 w-4" />
            Favorites
          </TabsTrigger>
          <TabsTrigger 
            value="recent"
            className={cn(
              "flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white",
              "flex items-center justify-center gap-2 transition-all duration-300"
            )}
          >
            <Clock className="h-4 w-4" />
            Recent
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {localOutfits.length > 0 ? (
              localOutfits.map((outfit) => (
                <OutfitCard 
                  key={outfit.id} 
                  outfit={outfit} 
                  clothingItems={userClothingItems.length > 0 ? userClothingItems : clothingItems}
                  getClothingItemById={getClothingItemById}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                  onOutfitAddedToCalendar={handleOutfitAddedToCalendar}
                />
              ))
            ) : (
              <p className="text-white/70 text-center col-span-full py-8">
                No outfits found. Create your first outfit!
              </p>
            )}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {favoriteOutfits.length > 0 ? (
              favoriteOutfits.map((outfit) => (
                <OutfitCard 
                  key={outfit.id} 
                  outfit={outfit} 
                  clothingItems={userClothingItems.length > 0 ? userClothingItems : clothingItems}
                  getClothingItemById={getClothingItemById}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                  onOutfitAddedToCalendar={handleOutfitAddedToCalendar}
                />
              ))
            ) : (
              <p className="text-white/70 text-center col-span-full py-8">
                You haven't added any outfits to your favorites yet.
              </p>
            )}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="recent">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {recentOutfits.length > 0 ? (
              recentOutfits.map((outfit) => (
                <OutfitCard 
                  key={outfit.id} 
                  outfit={outfit} 
                  clothingItems={userClothingItems.length > 0 ? userClothingItems : clothingItems}
                  getClothingItemById={getClothingItemById}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                  onOutfitAddedToCalendar={handleOutfitAddedToCalendar}
                />
              ))
            ) : (
              <p className="text-white/70 text-center col-span-full py-8">
                No recent outfits found.
              </p>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
      
      {/* Outfit Builder Modal for editing outfits */}
      {isBuilderOpen && (
        <OutfitBuilder
          isOpen={isBuilderOpen}
          onClose={() => {
            setIsBuilderOpen(false);
            setOutfitToEdit(null);
          }}
          onSave={handleUpdateOutfit}
          clothingItems={userClothingItems.length > 0 ? userClothingItems : clothingItems}
          initialOutfit={outfitToEdit}
        />
      )}
    </Card>
  );
};

export default OutfitTabSection;
