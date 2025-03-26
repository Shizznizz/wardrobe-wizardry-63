
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import WardrobeGrid from '@/components/WardrobeGrid';
import OliviaBloomAdvisor from '@/components/OliviaBloomAdvisor';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import UploadModal from '@/components/UploadModal';
import { ClothingItem } from '@/lib/types';
import { sampleClothingItems, sampleOutfits, sampleUserPreferences } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { Confetti } from '@/components/ui/confetti';
import { ArrowUpDown, Info, Shirt, Sparkles, LayoutGrid, ArrowRight } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Wardrobe = () => {
  const [items, setItems] = useState<ClothingItem[]>(sampleClothingItems);
  const [showUploadTip, setShowUploadTip] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasAddedItem, setHasAddedItem] = useState(false);
  const [sortOption, setSortOption] = useState<'newest' | 'favorites' | 'most-worn' | 'color' | 'most-matched' | 'weather-fit' | 'not-recent'>('newest');
  const [showCompactView, setShowCompactView] = useState(false);
  const { user } = useAuth();

  const handleUpload = (newItem: ClothingItem) => {
    setItems(prev => [newItem, ...prev]);
    toast.success('New item added to your wardrobe!');
    setShowUploadTip(true);
    
    if (!hasAddedItem) {
      setShowConfetti(true);
      setHasAddedItem(true);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, favorite: !item.favorite } 
          : item
      )
    );
    
    const item = items.find(item => item.id === id);
    if (item) {
      const action = !item.favorite ? 'added to' : 'removed from';
      toast.success(`${item.name} ${action} favorites`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  useEffect(() => {
    if (window.location.hash === '#upload') {
      const uploadSection = document.getElementById('upload-section');
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: 'smooth' });
        const uploadButton = document.getElementById('upload-button');
        if (uploadButton) {
          uploadButton.click();
        }
      }
    }
  }, []);

  const getOliviaTip = () => {
    if (items.length <= 3) {
      return "I see you're just starting to build your wardrobe! Try adding a few essential pieces like a versatile top, a pair of jeans, and shoes to start creating outfits.";
    } else if (items.filter(item => item.favorite).length === 0) {
      return "Don't forget to mark your favorite pieces! This helps me understand your style preferences when suggesting outfits.";
    } else {
      return "Great addition to your wardrobe! I've updated your style profile. Why not try matching this with other pieces to create a new outfit?";
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case 'favorites':
        return Number(b.favorite) - Number(a.favorite);
      case 'most-worn':
        return b.timesWorn - a.timesWorn;
      case 'color':
        return a.color.localeCompare(b.color);
      case 'most-matched':
        return b.timesWorn - a.timesWorn;
      case 'weather-fit':
        const currentSeason: 'winter' | 'spring' | 'summer' | 'autumn' = 'spring';
        return b.seasons.includes(currentSeason) ? -1 : 1;
      case 'not-recent':
        return a.timesWorn - b.timesWorn;
      default:
        return 0;
    }
  });

  const getPersonalizedGreeting = () => {
    if (user?.user_metadata?.name) {
      return `Hi ${user.user_metadata.name}, here's your wardrobe`;
    }
    return "My Wardrobe";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      
      {showConfetti && (
        <Confetti 
          duration={2000}
          onComplete={() => setShowConfetti(false)}
        />
      )}
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col lg:flex-row items-center gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:w-1/2"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Your Digital Wardrobe
              </h1>
              <p className="text-lg text-white/80 mb-6">
                Browse, organize, and visualize your clothes collection with powerful AI-driven insights.
              </p>
              <div className="flex flex-wrap gap-4">
                <div id="upload-button">
                  <UploadModal onUpload={handleUpload} />
                </div>
                <Button size="lg" variant="outline" className="border-purple-400/30 text-white hover:bg-white/10">
                  <ArrowRight className="mr-2 h-4 w-4" /> Browse By Category
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-3 shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <Card className="glass-dark border-white/10 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2 border-purple-400/30">
                        <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold flex items-center">
                          Wardrobe Insights
                          <Sparkles className="h-4 w-4 ml-2 text-yellow-300" />
                        </h3>
                        <p className="text-white/70">From Olivia Bloom</p>
                      </div>
                    </div>
                    <p className="text-white/90 italic">
                      "A well-organized wardrobe is the foundation of great style. Upload your favorite pieces and I'll help you discover countless outfit combinations."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
          
          <motion.div id="upload-section" variants={itemVariants} className="flex flex-col">
            <div className="flex flex-wrap justify-between items-center mb-6">
              <div className="relative">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  {getPersonalizedGreeting()}
                </h2>
                <div className="h-1 w-3/4 mt-2 bg-gradient-to-r from-blue-400/70 via-purple-400/70 to-pink-400/70 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                <p className="mt-3 text-gray-400 text-sm md:text-base font-light">
                  Your digital closet, always in style
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4 mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-full backdrop-blur-sm border border-white/5 shadow-md">
                <Badge variant="gradient" className="mr-1">
                  <ArrowUpDown className="h-3.5 w-3.5 mr-1 text-white" />
                  <span>Sort</span>
                </Badge>
                <ToggleGroup 
                  type="single" 
                  value={sortOption} 
                  onValueChange={(value) => value && setSortOption(value as any)}
                  className="bg-slate-800/40 rounded-full p-1"
                >
                  <ToggleGroupItem value="newest" size="sm" className="text-xs h-8 rounded-full data-[state=on]:bg-gradient-to-r from-blue-500/80 to-purple-500/80 data-[state=on]:text-white transition-all duration-200">Newest</ToggleGroupItem>
                  <ToggleGroupItem value="favorites" size="sm" className="text-xs h-8 rounded-full data-[state=on]:bg-gradient-to-r from-blue-500/80 to-purple-500/80 data-[state=on]:text-white transition-all duration-200">Favorites</ToggleGroupItem>
                  <ToggleGroupItem value="most-worn" size="sm" className="text-xs h-8 rounded-full data-[state=on]:bg-gradient-to-r from-blue-500/80 to-purple-500/80 data-[state=on]:text-white transition-all duration-200">Most Worn</ToggleGroupItem>
                  <ToggleGroupItem value="color" size="sm" className="text-xs h-8 rounded-full data-[state=on]:bg-gradient-to-r from-blue-500/80 to-purple-500/80 data-[state=on]:text-white transition-all duration-200">By Color</ToggleGroupItem>
                  <ToggleGroupItem value="most-matched" size="sm" className="text-xs h-8 rounded-full data-[state=on]:bg-gradient-to-r from-blue-500/80 to-purple-500/80 data-[state=on]:text-white transition-all duration-200">Most Matched</ToggleGroupItem>
                  <ToggleGroupItem value="weather-fit" size="sm" className="text-xs h-8 rounded-full data-[state=on]:bg-gradient-to-r from-blue-500/80 to-purple-500/80 data-[state=on]:text-white transition-all duration-200">Weather Fit</ToggleGroupItem>
                  <ToggleGroupItem value="not-recent" size="sm" className="text-xs h-8 rounded-full data-[state=on]:bg-gradient-to-r from-blue-500/80 to-purple-500/80 data-[state=on]:text-white transition-all duration-200">Not Recent</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 bg-slate-900/60 p-2 pl-3 pr-4 rounded-full backdrop-blur-sm border border-white/10 shadow-md transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 group">
                        <Switch 
                          id="compact-view" 
                          checked={showCompactView} 
                          onCheckedChange={setShowCompactView} 
                          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600 data-[state=unchecked]:bg-slate-700/60"
                        />
                        <Label 
                          htmlFor="compact-view" 
                          className="text-xs font-medium text-gray-300 cursor-pointer transition-colors group-hover:text-white flex items-center gap-1.5"
                        >
                          <LayoutGrid className="h-3.5 w-3.5 text-gray-400 group-hover:text-indigo-300 transition-colors" />
                          Compact View
                        </Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900/90 border-white/10 text-white">
                      <p className="text-xs">Show simplified view with fewer tags and smaller images</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </motion.div>
          
          {items.length <= 2 ? (
            <motion.div variants={itemVariants} className="mb-6">
              <Card className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/20">
                <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-purple-300" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-2">Let's start building your dream wardrobe!</h3>
                    <p className="text-gray-300 mb-4">Upload your favorite pieces to create fabulous outfit combinations.</p>
                    <UploadModal buttonText="Add Your First Item" onUpload={handleUpload} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
          
          <motion.div variants={itemVariants} className="glass-dark p-6 rounded-xl border border-white/10">
            <WardrobeGrid 
              items={sortedItems} 
              onToggleFavorite={handleToggleFavorite} 
              compactView={showCompactView}
            />
          </motion.div>
        </motion.div>
      </main>
      
      {showUploadTip && (
        <OliviaBloomAssistant
          message={getOliviaTip()}
          type="celebration"
          timing="medium"
          actionText="Got it!"
          onAction={() => setShowUploadTip(false)}
          position="bottom-right"
        />
      )}
      
      <OliviaBloomAdvisor 
        items={sampleClothingItems}
        userPreferences={{
          favoriteColors: sampleUserPreferences.favoriteColors,
          favoriteStyles: sampleUserPreferences.favoriteStyles
        }}
        showChatButton={false}
      />
    </div>
  );
};

export default Wardrobe;
