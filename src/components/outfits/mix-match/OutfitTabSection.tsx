
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Outfit, ClothingItem } from '@/lib/types';
import { Heart, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import OutfitCollectionSection from './OutfitCollectionSection';
import RecommendedOutfits from '@/components/outfits/RecommendedOutfits';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface OutfitTabSectionProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
}

const OutfitTabSection = ({ outfits, clothingItems }: OutfitTabSectionProps) => {
  const [activeTab, setActiveTab] = useState('my-collection');
  const [userOutfits, setUserOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  // Fetch outfits from Supabase that match items in user's wardrobe
  const fetchUserOutfits = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Fetch outfits from Supabase
      const { data: outfitsData, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching outfits:', error);
        toast.error('Failed to load your outfits');
        setIsLoading(false);
        return;
      }

      // If outfits were found, format them correctly
      if (outfitsData && outfitsData.length > 0) {
        // Get clothing item IDs from the user's wardrobe
        const userClothingItemIds = clothingItems.map(item => item.id);

        // Filter outfits to only include those that have items from the user's wardrobe
        const validOutfits = outfitsData.filter(outfit => {
          // Make sure outfit.items is an array
          const outfitItems = Array.isArray(outfit.items) ? outfit.items : [];
          // Check if at least one item in the outfit exists in the user's wardrobe
          return outfitItems.some(itemId => userClothingItemIds.includes(itemId));
        });

        // Format outfits for the application
        const formattedOutfits = validOutfits.map(outfit => ({
          id: outfit.id,
          name: outfit.name,
          items: Array.isArray(outfit.items) ? outfit.items : [],
          season: Array.isArray(outfit.season) ? outfit.season : ['all'],
          seasons: Array.isArray(outfit.season) ? outfit.season : ['all'],
          occasion: outfit.occasion || 'casual',
          occasions: Array.isArray(outfit.occasions) ? outfit.occasions : ['casual'],
          favorite: outfit.favorite || false,
          dateAdded: new Date(outfit.date_added || new Date()),
          timesWorn: outfit.times_worn || 0,
          tags: Array.isArray(outfit.tags) ? outfit.tags : []
        }));

        console.log("Fetched outfits from Supabase:", formattedOutfits);
        setUserOutfits(formattedOutfits);
      } else {
        // No outfits found or error occurred
        setUserOutfits([]);
      }
    } catch (err) {
      console.error('Exception fetching outfits:', err);
      toast.error('An error occurred while loading your outfits');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserOutfits();
  }, [user, clothingItems]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUserOutfits();
  };

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/50 backdrop-blur-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Outfit Collections</h3>
        {user && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="text-white/70 hover:text-white hover:bg-slate-800"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh outfits</span>
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="my-collection" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6 bg-slate-800/70">
          <TabsTrigger value="my-collection">My Collection</TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="recommended" className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Recommended
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-collection">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-64 bg-slate-800/50 rounded-xl" />
              ))}
            </div>
          ) : userOutfits.length > 0 ? (
            <OutfitCollectionSection 
              outfits={userOutfits} 
              clothingItems={clothingItems} 
            />
          ) : (
            <div className="text-center p-8 border border-dashed border-white/20 rounded-xl bg-slate-900/30">
              <h3 className="font-medium text-white mb-2">No outfits found with items from your wardrobe</h3>
              <p className="text-white/70">Create new outfits with your wardrobe items to see them here.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-64 bg-slate-800/50 rounded-xl" />
              ))}
            </div>
          ) : userOutfits.filter(outfit => outfit.favorite).length > 0 ? (
            <OutfitCollectionSection 
              outfits={userOutfits.filter(outfit => outfit.favorite)} 
              clothingItems={clothingItems} 
            />
          ) : (
            <div className="text-center p-8 border border-dashed border-white/20 rounded-xl bg-slate-900/30">
              <h3 className="font-medium text-white mb-2">No favorite outfits found</h3>
              <p className="text-white/70">Mark some outfits as favorites to see them here.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recommended">
          <RecommendedOutfits className="mb-4" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutfitTabSection;
