
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Outfit, ClothingItem } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { BookmarkPlus, Heart, RefreshCw, Copy, Save } from 'lucide-react';
import { toast } from 'sonner';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OutfitGroupsSectionProps {
  groupedOutfits: Record<string, Outfit[]>;
  onToggleFavorite: (id: string) => void;
  onOutfitAddedToCalendar?: (log: OutfitLog) => void;
  clothingItems: ClothingItem[];
}

const OutfitGroupsSection = ({ 
  groupedOutfits, 
  onToggleFavorite, 
  onOutfitAddedToCalendar,
  clothingItems
}: OutfitGroupsSectionProps) => {
  const [shownSimilarOutfits, setShownSimilarOutfits] = useState<{[key: string]: boolean}>({});
  
  const handleToggleFavorite = (id: string) => {
    onToggleFavorite(id);
  };
  
  const handleSaveToWardrobe = (outfit: Outfit) => {
    toast.success(`${outfit.name} has been saved to your wardrobe`, {
      description: "You can access it anytime from your wardrobe collection."
    });
  };
  
  const handleShowSimilarOutfits = (outfitId: string) => {
    setShownSimilarOutfits(prev => ({
      ...prev,
      [outfitId]: !prev[outfitId]
    }));
    
    if (!shownSimilarOutfits[outfitId]) {
      toast.success("Finding similar outfits...", {
        duration: 2000
      });
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {Object.entries(groupedOutfits).map(([group, outfits]) => (
        <motion.section 
          key={group} 
          variants={itemVariants}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{group}</h2>
            <Button 
              variant="outline"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 border-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {outfits.map(outfit => (
              <motion.div 
                key={outfit.id}
                variants={itemVariants}
              >
                <Card className="bg-slate-800/40 backdrop-blur-sm border border-white/10 overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <OutfitSuggestion 
                      outfit={outfit}
                      items={clothingItems}
                      hideActions={true}
                    />
                    
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {outfit.tags && outfit.tags.slice(0, 3).map((tag, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline"
                          className="bg-purple-500/10 border-purple-500/20 text-purple-200 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-white">{outfit.name}</h3>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto text-white/70 hover:text-pink-400 hover:bg-transparent"
                          onClick={() => handleToggleFavorite(outfit.id)}
                        >
                          <Heart className={`h-5 w-5 ${outfit.favorite ? 'fill-pink-500 text-pink-500' : ''}`} />
                        </Button>
                      </div>
                      
                      <div className="flex flex-col space-y-3">
                        <div className="p-3 bg-slate-700/30 rounded-lg relative">
                          <div className="absolute -top-2 left-3 px-2 py-0.5 bg-purple-600 rounded-full text-xs text-white font-medium">
                            Olivia's Thoughts
                          </div>
                          
                          <div className="flex mt-1">
                            <Avatar className="h-6 w-6 mr-2 border border-purple-400/30">
                              <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
                            </Avatar>
                            
                            <p className="text-xs text-white/80">
                              This {outfit.name.toLowerCase()} outfit is perfect for {outfit.occasions.join(", ")} occasions. 
                              The combination of colors creates a {outfit.seasons.includes("summer") ? "bright and cheerful" : "sophisticated"} look.
                            </p>
                          </div>
                        </div>
                      
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            className="flex-1 h-9 bg-slate-700/40 border-white/10 hover:bg-slate-700"
                            onClick={() => handleShowSimilarOutfits(outfit.id)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Similar
                          </Button>
                          
                          <Button 
                            variant="outline"
                            size="sm"
                            className="flex-1 h-9 bg-slate-700/40 border-white/10 hover:bg-slate-700"
                            onClick={() => handleSaveToWardrobe(outfit)}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {shownSimilarOutfits[outfit.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3"
                  >
                    <h4 className="text-sm font-medium text-white mb-2">Similar Outfits</h4>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {/* Simulation of similar outfits with the first 3 other outfits */}
                        {outfits.filter(o => o.id !== outfit.id).slice(0, 3).map(similarOutfit => (
                          <CarouselItem key={similarOutfit.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/2">
                            <Card className="bg-slate-800/40 backdrop-blur-sm border border-white/10">
                              <CardContent className="p-3">
                                <OutfitSuggestion 
                                  outfit={similarOutfit}
                                  items={clothingItems}
                                  hideActions={true}
                                  size="small"
                                />
                                <div className="mt-2 text-center">
                                  <p className="text-xs text-white/70">{similarOutfit.name}</p>
                                </div>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2 bg-slate-800/80" />
                      <CarouselNext className="right-2 bg-slate-800/80" />
                    </Carousel>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      ))}
    </motion.div>
  );
};

export default OutfitGroupsSection;
