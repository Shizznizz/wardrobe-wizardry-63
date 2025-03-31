
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Lock, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OutfitSelector from '@/components/OutfitSelector';
import { ClothingItem, Outfit } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CollectionItem {
  id: string;
  name: string;
  description: string;
  outfits: Outfit[];
  premium?: boolean;
}

interface OutfitSelectionSectionProps {
  fashionCollections: CollectionItem[];
  clothingItems: ClothingItem[];
  selectedOutfit: Outfit | null;
  isPremiumUser: boolean;
  onSelectOutfit: (outfit: Outfit) => void;
}

const OutfitSelectionSection = ({
  fashionCollections,
  clothingItems,
  selectedOutfit,
  isPremiumUser,
  onSelectOutfit
}: OutfitSelectionSectionProps) => {
  const [activeTab, setActiveTab] = useState<'olivia-pick' | 'your-outfits'>('olivia-pick');
  const isMobile = useIsMobile();

  const handleTabChange = (value: 'olivia-pick' | 'your-outfits') => {
    setActiveTab(value);
  };

  const oliviasRecommendedOutfits = fashionCollections.find(c => c.id === 'recommended')?.outfits || [];
  const yourOutfits = fashionCollections.find(c => c.id === 'wardrobe')?.outfits || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <Card className="glass-dark border-white/10 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold">Choose an Outfit</h2>
            
            <div className="flex space-x-3">
              {!isMobile && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-purple-400/30 text-white hover:bg-white/10"
                >
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
              )}
              <Button 
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Outfit
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={(val) => handleTabChange(val as any)}>
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-6 bg-slate-800/50">
              <TabsTrigger 
                value="olivia-pick" 
                className="data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-500"
              >
                Olivia's Picks
              </TabsTrigger>
              <TabsTrigger 
                value="your-outfits" 
                className="data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-500"
              >
                Your Outfits
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="olivia-pick" className="mt-0 space-y-4">
              <p className="text-white/80 mb-4">
                Olivia has selected these outfits based on your style preferences and the current weather.
              </p>
              
              <OutfitSelector
                outfits={oliviasRecommendedOutfits}
                clothingItems={clothingItems}
                onSelect={onSelectOutfit}
                selectedOutfitId={selectedOutfit?.id}
              />
            </TabsContent>
            
            <TabsContent value="your-outfits" className="mt-0 space-y-4">
              <p className="text-white/80 mb-4">
                Try on outfits you've created in your personal wardrobe.
              </p>
              
              {yourOutfits.length > 0 ? (
                <OutfitSelector
                  outfits={yourOutfits}
                  clothingItems={clothingItems}
                  onSelect={onSelectOutfit}
                  selectedOutfitId={selectedOutfit?.id}
                />
              ) : (
                <div className="text-center py-10 bg-slate-800/30 rounded-lg border border-white/10">
                  <p className="text-white/70 mb-4">You haven't created any outfits yet</p>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90">
                    Create Your First Outfit
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Premium Collections Section - Rearranged as a 3-column grid */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Premium Collections
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {fashionCollections.filter(c => c.premium).map((collection) => (
                <motion.div 
                  key={collection.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-slate-800/50 rounded-lg p-4 border border-white/10 shadow-lg shadow-purple-900/10 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80"></div>
                  <div className="relative z-10">
                    <h4 className="font-medium mb-1">{collection.name}</h4>
                    <p className="text-sm text-white/70 mb-3">{collection.description}</p>
                    
                    {!isPremiumUser && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="absolute bottom-3 right-3">
                              <Lock className="h-5 w-5 text-yellow-400" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-900 border-slate-700 text-white">
                            <p className="text-xs">Upgrade to unlock this collection</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default OutfitSelectionSection;
