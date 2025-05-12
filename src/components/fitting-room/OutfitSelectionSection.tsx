
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Check, FilterIcon } from 'lucide-react';
import { Outfit, ClothingItem, ClothingSeason } from '@/lib/types';
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
  
  // Filter states - using 'all' or valid ClothingSeason values
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  
  // Fetch user's outfits from Supabase
  useEffect(() => {
    if (user) {
      const fetchUserOutfits = async () => {
        setIsLoading(true);
        
        try {
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
      
      fetchUserOutfits();
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
      className="mb-8"
    >
      <Card className="glass-dark border-white/10 overflow-hidden shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            Choose an Outfit to Try On
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-white/60" />
              <span className="text-sm text-white/60">Filters:</span>
            </div>
            
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-[140px] h-8 text-xs bg-white/5 border-white/10">
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
              <SelectTrigger className="w-[140px] h-8 text-xs bg-white/5 border-white/10">
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
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
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
              <div className="space-y-8">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                  </div>
                ) : filteredUserOutfits.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredUserOutfits.map((outfit) => (
                      <OutfitCard 
                        key={outfit.id} 
                        outfit={outfit} 
                        onSelect={handleSelectOutfit} 
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
}

const OutfitCard = ({ outfit, onSelect, isAiGenerated = false }: OutfitCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:border-purple-400/30 transition-colors"
    >
      <div className="aspect-square relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
          <h3 className="text-lg font-medium text-white">{outfit.name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
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
      </div>
      
      <div className="grid grid-cols-2 gap-1 p-2">
        {[1, 2, 3, 4].map((_, index) => (
          <div 
            key={index} 
            className="aspect-square w-full rounded-md bg-slate-800/80 border border-white/5 overflow-hidden"
          >
            <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
              Item {index + 1}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4">
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => onSelect(outfit)}
        >
          <Check className="mr-2 h-4 w-4" /> Try This On
        </Button>
      </div>
    </motion.div>
  );
};

export default OutfitSelectionSection;
