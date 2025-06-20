import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Check, FilterIcon, Shirt } from 'lucide-react';
import { ClothingSeason, ClothingOccasion, Outfit, ClothingItem } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OutfitSelectionSectionProps {
  isPremiumUser: boolean;
  onSelectOutfit: (outfit: Outfit) => void;
}

const OutfitSelectionSection = ({
  isPremiumUser,
  onSelectOutfit
}: OutfitSelectionSectionProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('your-outfits');
  const [userOutfits, setUserOutfits] = useState<Outfit[]>([]);
  const [aiOutfits, setAiOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  
  // Filter states - using 'all' or valid ClothingSeason values
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  
  // Fetch user's outfits and clothing items from Supabase
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        setIsLoading(true);
        
        try {
          // First fetch the clothing items
          const { data: clothingData, error: clothingError } = await supabase
            .from('clothing_items')
            .select('*')
            .eq('user_id', user.id);
          
          if (clothingError) {
            console.error('Error fetching clothing items:', clothingError);
            toast.error('Failed to load your wardrobe items');
          } else if (clothingData) {
            // Format clothing data
            const formattedClothing: ClothingItem[] = clothingData.map(item => ({
              id: item.id,
              name: item.name,
              type: item.type,
              imageUrl: item.image_url,
              image: item.image_url,
              color: item.color,
              material: item.material || '',
              season: Array.isArray(item.season) ? item.season : ['all'],
              occasions: Array.isArray(item.occasions) ? item.occasions : ['casual'],
              favorite: item.favorite || false,
              timesWorn: item.times_worn || 0,
              dateAdded: new Date(item.date_added)
            }));
            
            setClothingItems(formattedClothing);
          }
          
          // Now fetch the outfits
          const { data, error } = await supabase
            .from('outfits')
            .select('*')
            .eq('user_id', user.id);
          
          if (error) {
            console.error('Error fetching outfits:', error);
            toast.error('Failed to load your outfits');
            setUserOutfits([]);
          } else if (data) {
            // Format the data to match Outfit type
            const formattedOutfits: Outfit[] = data.map(outfitData => ({
              id: outfitData.id,
              name: outfitData.name || `Outfit ${outfitData.id.slice(0, 4)}`,
              items: outfitData.items || [],
              seasons: outfitData.season || ['all'],
              occasions: outfitData.occasions || [outfitData.occasion || 'casual'],
              favorite: outfitData.favorite || false,
              dateAdded: new Date(outfitData.date_added || outfitData.created_at)
            }));
            
            setUserOutfits(formattedOutfits);
            
            // Just for demonstration, create some AI outfits based on user's outfits
            if (formattedOutfits.length > 0) {
              const demoAiOutfits = formattedOutfits.slice(0, 3).map(outfit => ({
                ...outfit,
                id: `ai-${outfit.id}`,
                name: `AI ${outfit.name}`,
                isAiGenerated: true
              }));
              setAiOutfits(demoAiOutfits);
            }
          }
        } catch (err) {
          console.error('Exception fetching outfits:', err);
          toast.error("Couldn't load your outfits");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserData();
    }
  }, [user]);
  
  // Filter outfits based on selected filters
  const filteredUserOutfits = userOutfits.filter(outfit => {
    // Use type guard to ensure selectedSeason matches ClothingSeason or is 'all'
    const matchesSeason = selectedSeason === 'all' || (outfit.seasons?.includes(selectedSeason as ClothingSeason));
    const matchesStyle = selectedStyle === 'all' || outfit.occasions?.includes(selectedStyle);
    return matchesSeason && matchesStyle;
  });
  
  const filteredAiOutfits = aiOutfits.filter(outfit => {
    // Use type guard to ensure selectedSeason matches ClothingSeason or is 'all'
    const matchesSeason = selectedSeason === 'all' || (outfit.seasons?.includes(selectedSeason as ClothingSeason));
    const matchesStyle = selectedStyle === 'all' || outfit.occasions?.includes(selectedStyle);
    return matchesSeason && matchesStyle;
  });
  
  // Helper function to get clothing item by ID
  const getClothingItemById = (itemId: string): ClothingItem | undefined => {
    return clothingItems.find(item => item.id === itemId);
  };
  
  const handleSelectOutfit = (outfit: Outfit) => {
    onSelectOutfit(outfit);
    
    // Scroll to preview section
    setTimeout(() => {
      document.getElementById('result-preview-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const seasons = ['all', 'spring', 'summer', 'fall', 'winter'];
  const styles = ['all', 'casual', 'formal', 'business', 'athletic', 'evening'];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-5" // Reduced bottom margin from mb-6 to mb-5
    >
      <Card className="glass-dark border-white/10 overflow-hidden shadow-lg">
        <CardContent className="p-4"> {/* Reduced padding from p-5 to p-4 */}
          <h2 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            Choose an Outfit to Try On
          </h2>

          {/* Filters - Enhanced with subtle styling */}
          <div className="flex flex-wrap gap-3 mb-4 sticky top-0 z-10 bg-black/20 backdrop-blur-sm p-2 rounded-lg border border-white/10 shadow-sm">
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-white/60" />
              <span className="text-sm text-white/60">Filters:</span>
            </div>
            
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-[140px] h-8 text-xs bg-white/5 border-white/20 hover:border-white/40 transition-colors shadow-inner">
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {seasons.map(season => (
                    <SelectItem key={season} value={season} className="capitalize">
                      {season === 'all' ? 'All Seasons' : season}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="w-[140px] h-8 text-xs bg-white/5 border-white/20 hover:border-white/40 transition-colors shadow-inner">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {styles.map(style => (
                    <SelectItem key={style} value={style} className="capitalize">
                      {style === 'all' ? 'All Styles' : style}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Tabs 
            defaultValue="your-outfits" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-4"> {/* Reduced margin from mb-6 to mb-4 */}
              <TabsTrigger value="your-outfits">Your Outfits</TabsTrigger>
              <TabsTrigger 
                value="ai-suggested"
                disabled={!isPremiumUser}
                className="relative"
              >
                <span>AI Suggested</span>
                {!isPremiumUser && (
                  <span className="absolute right-1 top-1/2 -translate-y-1/2">
                    <Lock className="h-3.5 w-3.5 text-yellow-300/80" />
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="your-outfits">
              <div className="space-y-4"> {/* Reduced from space-y-6 to space-y-4 */}
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                  </div>
                ) : filteredUserOutfits.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredUserOutfits.map((outfit) => (
                      <OutfitCard 
                        key={outfit.id} 
                        outfit={outfit} 
                        onSelect={handleSelectOutfit}
                        getClothingItemById={getClothingItemById}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-white/70">No outfits found matching your filters.</p>
                    <Button 
                      variant="outline"
                      className="mt-4 border-blue-400/30 text-blue-300 hover:bg-blue-900/20"
                      onClick={() => {
                        setSelectedSeason('all');
                        setSelectedStyle('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="ai-suggested">
              <div className="space-y-8">
                {isPremiumUser ? (
                  filteredAiOutfits.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredAiOutfits.map((outfit) => (
                        <OutfitCard 
                          key={outfit.id} 
                          outfit={outfit} 
                          onSelect={handleSelectOutfit}
                          isAiGenerated
                          getClothingItemById={getClothingItemById}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-lg text-white/70">No AI-suggested outfits found matching your filters.</p>
                      <Button 
                        variant="outline"
                        className="mt-4 border-blue-400/30 text-blue-300 hover:bg-blue-900/20"
                        onClick={() => {
                          setSelectedSeason('all');
                          setSelectedStyle('all');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 text-center">
                    <Lock className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2 text-white">Premium Feature</h3>
                    <p className="text-white/70 mb-6 max-w-md mx-auto">
                      Unlock AI-suggested outfits personalized to your style preferences and body type with Premium.
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-semibold hover:from-yellow-400 hover:to-amber-500"
                    >
                      Upgrade to Premium
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface OutfitCardProps {
  outfit: Outfit;
  onSelect: (outfit: Outfit) => void;
  isAiGenerated?: boolean;
  getClothingItemById: (id: string) => ClothingItem | undefined;
}

const OutfitCard = ({ outfit, onSelect, isAiGenerated = false, getClothingItemById }: OutfitCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:border-purple-400/30 transition-all duration-300"
    >
      {/* Title and badge section */}
      <div className="p-3 pb-2">
        <h3 className="text-lg font-medium text-white">{outfit.name}</h3>
        <div className="flex flex-wrap gap-1.5 mt-1.5 mb-1">
          {isAiGenerated && (
            <Badge className="bg-purple-500/70 text-white border-none">AI Generated</Badge>
          )}
          {outfit.occasions?.slice(0, 1).map(occasion => (
            <Badge key={occasion} className="bg-slate-700/70 text-white border-none capitalize">
              {occasion}
            </Badge>
          ))}
          {outfit.seasons?.slice(0, 1).map(season => (
            <Badge key={season} className="bg-blue-700/70 text-white border-none capitalize">
              {season}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Outfit items grid - improved layout and styling */}
      <div className="grid grid-cols-2 gap-2 p-3 pt-0">
        {Array.isArray(outfit.items) && outfit.items.length > 0 ? (
          // If there are items, render them in the grid
          outfit.items.slice(0, 4).map((itemId, index) => {
            const item = getClothingItemById(itemId);
            return (
              <motion.div 
                key={`${itemId}-${index}`}
                whileHover={{ scale: 1.08, zIndex: 10 }}
                className="aspect-square w-full rounded-md overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 relative"
              >
                {item?.imageUrl ? (
                  <div className="w-full h-full overflow-hidden rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.2)]">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name || `Item ${index + 1}`}
                      className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/30 bg-slate-800/80 rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.2)]">
                    <Shirt className="h-6 w-6 mb-1 opacity-50" />
                    <span className="text-xs text-center">
                      {item?.name || `Item ${index + 1}`}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          // If no items, show a placeholder centered
          <div className="col-span-2 flex items-center justify-center h-32 text-white/30">
            <div className="text-center">
              <Shirt className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No items in this outfit</p>
            </div>
          </div>
        )}
      </div>
      
      {/* CTA Button - improved alignment and effects */}
      <div className="px-3 pb-3">
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-500 text-white transition-all duration-300 
                   shadow-sm hover:shadow-[0_0_12px_rgba(168,85,247,0.5)] hover:brightness-110"
          onClick={() => onSelect(outfit)}
        >
          <Check className="mr-2 h-4 w-4" /> Try This On
        </Button>
      </div>
    </motion.div>
  );
};

export default OutfitSelectionSection;
