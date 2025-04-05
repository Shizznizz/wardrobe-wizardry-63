
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Lock, Filter, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OutfitSelector from '@/components/OutfitSelector';
import { ClothingItem, Outfit } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface CollectionItem {
  id: string;
  name: string;
  description: string;
  outfits: Outfit[];
  premium?: boolean;
  popular?: boolean;
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
  const [selectedPremiumCollection, setSelectedPremiumCollection] = useState<CollectionItem | null>(null);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  const handleTabChange = (value: 'olivia-pick' | 'your-outfits') => {
    setActiveTab(value);
  };

  const handlePremiumClick = (collection: CollectionItem) => {
    if (isPremiumUser) {
      // Navigate to collection
      console.log('Exploring collection:', collection.name);
    } else {
      // Show premium details
      setSelectedPremiumCollection(collection);
      setShowPremiumDialog(true);
    }
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
      <Card className="glass-dark border-white/10 overflow-hidden shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">Choose an Outfit</h2>
            
            <Button 
              ref={filterButtonRef}
              variant="outline" 
              size="sm"
              className="border-purple-400/30 text-white hover:bg-white/10 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" /> Filter Outfits
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={(val) => handleTabChange(val as any)} className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-6 bg-slate-800/50">
              <TabsTrigger 
                value="olivia-pick" 
                className="data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-500 relative overflow-hidden group"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-500/20 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0"
                  animate={{ 
                    x: ["0%", "100%", "0%"],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
                Olivia's Picks
              </TabsTrigger>
              <TabsTrigger 
                value="your-outfits" 
                className="data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-500 relative overflow-hidden group"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-500/20 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0"
                  animate={{ 
                    x: ["0%", "100%", "0%"],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
                Your Outfits
              </TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
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
              </motion.div>
            </AnimatePresence>
          </Tabs>
          
          {/* Premium Collections Section - Rearranged as a 3-column grid */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Premium Collections
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {fashionCollections.filter(c => c.premium).map((collection) => (
                <motion.div 
                  key={collection.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative overflow-hidden group cursor-pointer"
                >
                  <div className={cn(
                    "rounded-lg p-5 h-full border shadow-lg flex flex-col justify-between relative overflow-hidden z-10",
                    isPremiumUser 
                      ? "border-purple-400/30 bg-gradient-to-br from-slate-800/90 via-purple-900/20 to-slate-900/80" 
                      : "border-amber-500/20 bg-gradient-to-br from-slate-800/90 via-amber-900/10 to-slate-900/80"
                  )}>
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 backdrop-blur-sm bg-white/5 z-[-1]"></div>
                    
                    {/* Premium visual indicator */}
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-amber-500/20 rotate-12 blur-xl rounded-full"></div>
                    
                    {/* Animated shimmer effect for locked collections */}
                    {!isPremiumUser && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"
                        animate={{ 
                          x: ['-100%', '100%'],
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "linear",
                          repeatDelay: 0.5
                        }}
                      />
                    )}
                    
                    {collection.popular && (
                      <div className="absolute -top-1 -right-1">
                        <Badge variant="outline" className="font-medium text-xs bg-amber-500/80 text-white border-0 shadow-lg px-2 py-0.5 flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                        {collection.name}
                      </h4>
                      <p className="text-sm text-white/70 mb-3">{collection.description}</p>
                      
                      {!isPremiumUser && (
                        <div className="flex items-center gap-1 mb-2 text-xs text-white/60">
                          <Users className="h-3 w-3" />
                          <span>
                            {Math.floor(Math.random() * 250) + 50} people are using this collection
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      {!isPremiumUser ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center">
                                <motion.div
                                  animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 10, 0, -10, 0],
                                  }}
                                  transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    repeatDelay: 1
                                  }}
                                  className="text-amber-400"
                                >
                                  <Lock className="h-5 w-5" />
                                </motion.div>
                                <span className="ml-2 text-amber-300 text-sm">Premium</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-slate-900 border-slate-700 text-white max-w-xs p-3">
                              <p className="text-xs mb-2">Unlock {collection.name} and all Premium collections with a Olivia Bloom subscription.</p>
                              <p className="text-amber-400 text-xs">Includes {collection.outfits.length} curated outfits</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-purple-300 text-sm">Available</span>
                      )}
                      <Button 
                        size="sm" 
                        onClick={() => handlePremiumClick(collection)}
                        className={isPremiumUser 
                          ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90" 
                          : "bg-gradient-to-r from-amber-600 to-amber-500 hover:opacity-90"}
                      >
                        {isPremiumUser ? 'Explore' : 'Learn More'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Premium Collection Dialog */}
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent className="bg-slate-900 border-purple-500/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500">
              {selectedPremiumCollection?.name} Collection
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Unlock this premium collection and elevate your style.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-white/10">
              <h4 className="font-medium text-white mb-2">Collection Highlights:</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{selectedPremiumCollection?.outfits.length} expertly curated outfits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Perfect for all {selectedPremiumCollection?.outfits[0]?.seasons.join(', ')} occasions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Personalized to your style preferences</span>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowPremiumDialog(false)}>
                Maybe Later
              </Button>
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90">
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default OutfitSelectionSection;
